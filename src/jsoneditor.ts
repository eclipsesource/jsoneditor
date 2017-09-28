import {
  JsonForms,
  JsonFormsElement,
  JsonSchema,
  MasterDetailLayout,
  UISchemaElement
} from 'jsonforms';
import { ModelMapping } from './editor-config';
import { Editor } from './editor';
import * as _ from 'lodash';
import { EditorConfiguration } from './editor-config';

export * from './toolbar';
export * from './editor';
export * from './editor-config';

/**
 * The JsonEditor renders JSON data specified by a JSON Schema.
 * It displays the data's containment hierarchy in a tree and allows to
 * edit the data objects' properties.
 * Thereby, the visual representation of the editor can be customized by providing
 * mappings that map types defined in the schema to images, define the types'
 * naming property, and defining a mapping between an object's property and its type.
 */
export class JsonEditor extends HTMLElement implements Editor {
  private connected = false;
  private dataObject: object;
  private dataSchema: JsonSchema;
  private jsonforms: JsonFormsElement;
  private masterDetail: MasterDetailLayout = {
    'type': 'MasterDetailLayout',
    'scope': {
      '$ref': '#'
    },
    'options': {}
  };
  constructor() {
    super();
  }
  connectedCallback(): void {
    this.connected = true;
    this.render();
  }
  diconnectedCallback(): void {
    this.connected = false;
  }
  /**
   * Returns the current data displayed in the editor.
   */
  get data() {
    return this.dataObject;
  }
  /**
   * Sets the data edited in the editor
   */
  set data(data: object) {
    this.dataObject = data;
    JsonForms.rootData = data;
    this.render();
  }

  /**
   * Set the JsonSchema defining the editor's data.
   */
  set schema(schema: JsonSchema) {
    this.dataSchema = schema;
  }
  /**
   * Get the JsonSchema defining the editor's data.
   */
  get schema() {
    return this.dataSchema;
  }

  /**
   * Allows to configure the editor with a single EditorConfiguration object.
   */
  configure(config: EditorConfiguration) {
    if (!_.isEmpty(config.imageMapping)) {
      this.setImageMapping(config.imageMapping);
    }
    if (!_.isEmpty(config.labelMapping)) {
      this.setLabelMapping(config.labelMapping);
    }
    if (!_.isEmpty(config.modelMapping)) {
      this.setModelMapping(config.modelMapping);
    }
    // register all UI Schemata
    if (!_.isEmpty(config.detailSchemata)) {
      Object.keys(config.detailSchemata).forEach(key => {
        try {
          const uiSchema = config.detailSchemata[key] as UISchemaElement;
          this.registerDetailSchema(key, uiSchema);
        } catch (e) {
          console.warn(`Data registered for id '${key}' is not a valid UI Schema:`,
                       config.detailSchemata[key]);
        }
      });
    }
    if (!_.isEmpty(config.resources)) {
      Object.keys(config.resources).forEach(name => {
        this.registerResource(name, config.resources[name]);
      });
    }
    this.dataSchema = config.dataSchema;
    if (!_.isEmpty(config.data)) {
      this.data = config.data;
    } else {
      this.data = {};
    }
  }

  /**
   * Configures the label mappings for the types defined in the editor's schema.
   * A label mapping maps from a schema id to a property defined in this schema.
   * This property defines the name of a rendered object in the containment tree.
   */
  setLabelMapping(labelMapping): void {
    this.masterDetail.options.labelProvider = labelMapping;
  }

  /**
   * Configures the image mappings for the types defined in the editor's schema.
   * An image mapping maps from a schema id to the schema's image name.
   * This name is used to resolve the css style that configure a label
   * for instances of the type in the containment tree.
   */
  setImageMapping(imageMapping): void {
    this.masterDetail.options.imageProvider = imageMapping;
  }

  /**
   * The model mapping defines mappings from a property value to a type.
   * Thereby, the model mapping defines which property is considered.
   * This property is the same for all types.
   * A mapping maps from a specific value of this property to a schema id.
   * If an element contains a mapped value in the defined property,
   * it is assumed to be of the type defined by the mapped schema id.
   *
   * A model mapping is necessary for all types used in anyOf sections of a schema
   * in order to determine which type objects of a "anyOf-property" belong to.
   */
  setModelMapping(modelMapping: ModelMapping): void {
    JsonForms.modelMapping = modelMapping;
    this.masterDetail.options.modelMapping = modelMapping;
  }

  /**
   * Register a resource for the given name.
   * The resource can be used as reference target or to specify a reference target schema.
   */
  registerResource(name: string, resource: Object) {
    // Register resource and resolve JSON References/Pointers
    JsonForms.resources.registerResource(name, resource, true);
  }

  /**
   * Registers a UI Schema for objects defined by the schema specified by the given schema id.
   * A registered UI Schema is used when rendering a suitable object
   * that was selected in the containment tree.
   * The UI Schema specifies rendered controls, layouts, and additional rendering information.
   * Thereby, the UI Schema is the same as the UI Schemata used in JsonForms 2.
   *
   * @param {string} schemaId The id of the type's JsonSchema that the UI Schema is registered for
   * @param {UISchemaElement} uiSchema The UI Schema to use when rendering instances of the schema
   */
  registerDetailSchema(schemaId: string, uiSchema: UISchemaElement) {
    JsonForms.uischemaRegistry.register(uiSchema, (schema, data) =>
      schema.id !== undefined && schema.id === schemaId ? 2 : -1);
  }

  private render(): void {
    if (!this.connected || this.dataObject === undefined || this.dataObject === null
        || _.isEmpty(this.dataSchema)) {
      return;
    }
    if (this.jsonforms === undefined) {
      this.jsonforms = document.createElement('json-forms') as JsonFormsElement;
    }
    this.jsonforms.uiSchema = this.masterDetail;
    this.jsonforms.dataSchema = this.dataSchema;
    this.jsonforms.data = this.dataObject;
    this.appendChild(this.jsonforms);
  }
}

if (!customElements.get('json-editor')) {
  customElements.define('json-editor', JsonEditor);
}
