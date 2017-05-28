import {JsonSchema} from 'jsonforms/dist/ts-build/models/jsonSchema';
import { ItemModel, MultipleItemModel, DummyModel, ReferenceModel, MULTIPLICITY_TYPES, isItemModel}
  from './item_model';
import {retrieveResolvableSchema} from 'jsonforms/dist/ts-build/path.util';
import * as SchemaRefParser from 'json-schema-ref-parser';
// import * as JSONRefs from 'json-refs';

export class SchemaExtractor {
  private addedRefs: {[key: string]: ItemModel|MultipleItemModel|DummyModel|ReferenceModel} = {};
  private $refs;
  constructor(private schema: JsonSchema) { }


  public extract(): Promise<ItemModel|MultipleItemModel|null|DummyModel|ReferenceModel> {
    this.$refs = {};
    // return this.resolveRef(undefined);
    return SchemaRefParser.resolve(this.schema).then($refs => {
      this.$refs = $refs;
      return new Promise<ItemModel|MultipleItemModel|null|DummyModel|ReferenceModel>
      ((resolve, reject) => {
        const result = this.parse('root', this.schema, true);
        this.cleanUp(result);
        resolve(result);
      });
    });
  }
  // private resolveRef(subDocPath: string):
  //   Promise<ItemModel|MultipleItemModel|null|DummyModel|ReferenceModel> {
  //   return JSONRefs.resolveRefs(this.schema, {subDocPath: subDocPath}).then($refs => {
  //     Object.keys($refs.refs).forEach(key => {
  //       const ref = $refs.refs[key];
  //       if (ref.missing && this.$refs[ref.uri] === undefined) {
  //         this.$refs[ref.uri] = null;
  //         this.resolveRef(ref.uri).then(res => {
  //           this.$refs[ref.uri] = res;
  //         });
  //       }
  //       if (!ref.circular) {
  //         this.$refs[ref.uri] = ref.value;
  //       }
  //     });
  //     return new Promise<ItemModel|MultipleItemModel|null|DummyModel|ReferenceModel>
  //     ((resolve, reject) => {
  //       const result = this.parse('root', this.schema, true);
  //       this.cleanUp();
  //       resolve(result);
  //     });
  //   });
  // }
  private cleanUp(rootResult: ItemModel|MultipleItemModel|DummyModel|ReferenceModel): void {
    Object.keys(this.addedRefs).forEach(ref => {
      const model = this.addedRefs[ref];
      if (isItemModel(model)) {
        const resolvedSchema = retrieveResolvableSchema(this.schema, ref);
        model.schema = resolvedSchema;
        if (model !== rootResult) {
          if (resolvedSchema.type === 'array' || resolvedSchema.items !== undefined) {
            model.schema = resolvedSchema.items;
          }
        }
      }
    });
  }

  /**
  * Parses the property with the given name from the given JsonSchema.
  * If the property is a simple property (e.g. a string, number, etc.) it is ignored.
  * For object properties, an ItemModel is created.
  * References are resolved and an ItemModel is created, too.
  * Links are resolved to a ReferenceModel.
  * The parsing works recursively and child properties of the current schema
  * are parsed, too.
  * TODO update documentation
  */
  private parse(property: string, schema: JsonSchema, root: boolean):
    ItemModel|MultipleItemModel|null|DummyModel|ReferenceModel {
    if (schema['links'] === undefined && (schema.type === 'string' || schema.type === 'number' ||
      schema.type === 'integer' || schema.type === 'boolean')) {
      return null;
    }
    const result = {label: property, schema: schema, dropPoints: {}}; // , fullschema: this.schema

    // Resolve and parse links to external schemata:
    // If there is only one link: get the linked schema, create a ReferenceModel,
    // and return it instead of the current result model
    // If there are multiple links: Create a droppoint for each one in the current
    // ItemModel.
    if (schema['links'] !== undefined) {
      const links = schema['links'];
      if (links.length === 1 && Object.keys(schema.properties).length === 1) {
        let targetModel = undefined;
        const link = links[0];
        if (link['targetSchema'] !== undefined) {
          targetModel = this.handleReference(link['targetSchema'], root);
        }
        return {href: link['href'], targetModel: targetModel,
        label: property, schema: schema } as ReferenceModel;
      }
      links.forEach(link => {
        let targetModel = undefined;
        if (link['targetSchema'] !== undefined) {
          targetModel = this.handleReference(link['targetSchema'], root);
        }
        const hrefSegments = link['href'].split('/');
        // the variable is the last
        const variable = hrefSegments[hrefSegments.length - 1];
        const key = variable.substring(1, variable.length - 1);

        const refModel = {href: link['href'], targetModel: targetModel,
          label: key, schema: schema.properties[key] } as ReferenceModel;
        result.dropPoints[key] = refModel;
      });
    }

    // If the schema is of type array and only allows one item type (no tuples),
    // the schema defining the array items (schema.items) is parsed
    // and returned - except if the current element is the root element.
    // In this case, the property is added as a drop point to the root result.
    if (schema.type === 'array' || schema.hasOwnProperty('items')) {
      const itemSchema = schema.items;
      if (!(itemSchema instanceof Array)) {
        const innerItem = this.parse(root ? 'array' : property, itemSchema, root);
        if (!root) {
          return innerItem;
        }
        if (innerItem !== null) {
          result.dropPoints['array'] = innerItem;
        }
      }
    }

    // Create an ItemModel for schemas of type object.
    // Parse every property of the schema and add a droppoint, if a model is returned.
    // If the schema is not the root and has additionalProperties of type object,
    // parse this object and return it instead of the current result
    if (schema.type === 'object') {
      if (schema.properties !== undefined) {
        Object.keys(schema.properties).forEach(key => {
          const innerItem = this.parse(key, schema.properties[key], false);
          if (innerItem !== null) {
            result.dropPoints[key] = innerItem;
          }
        });
      }
      // TODO: potential problem when there are normal and additionalProperties?
      // normal properties could be disregarded, as additionalProperties if case
      // returns the inner droppoint and disregards the result
      if (schema.additionalProperties !== undefined &&
        typeof schema.additionalProperties === 'object') {
        const inner = this.parse(root ? 'object' : property, schema.additionalProperties, false);
        if (!root) {
          return inner;
        }
        if (inner !== null) {
          result.dropPoints['object'] = inner;
        }
      }
    }

    // If the schema references another element: resolve it and return the resulting model
    if (schema.$ref !== undefined) {
      return this.handleReference(schema.$ref, root);
    }

    // If the schema defines the anyOf property, create a MultipleItemModel,
    // parse the schemas of the anyOf options and add the resulting models
    // to the MultipleItemModel
    if (schema.anyOf !== undefined) {
      const current = {models: [], type: MULTIPLICITY_TYPES.ANY_OF};
      schema.anyOf.forEach(inner => {
        current.models.push(this.parse(property, inner, root));
      });
      return current;
    }
    return result;
  }

  /**
  * Resolves a reference to its type name and JsonSchema.
  */
  private resovleLocalRef(ref: string): {name: string, schema: JsonSchema} {
    const name = ref.substr(ref.lastIndexOf('/') + 1);
    const refSchema = this.$refs.get(ref);
    // const refSchema = this.$refs[ref];
    return {name: name, schema: refSchema};
  }

  /**
  * If the reference has already been resolved before in the parsing process,
  * return the existing model.
  * Otherwise, get the schema associated with the reference and parse the schema to a model.
  * Save the model in case the same reference occurs again to avoid multiple parsings
  * and to allow endless recursion(?).
  */
  private handleReference(ref: string, root: boolean):
    ItemModel|DummyModel|ReferenceModel|MultipleItemModel {
    if (!this.addedRefs.hasOwnProperty(ref)) {
      this.addedRefs[ref] = {};
      const wrapper = this.resovleLocalRef(ref);
      const realValue = this.parse(wrapper.name, wrapper.schema, root);
      const tempValue = this.addedRefs[ref];
      Object.keys(realValue).forEach(key => tempValue[key] = realValue[key]);
    }
    return this.addedRefs[ref];
  }
}
