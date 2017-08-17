import {
  JsonForms,
  JsonFormsElement,
  JsonSchema,
  MasterDetailLayout
} from 'jsonforms';
import { ModelMapping } from './modelmapping';
import { Editor } from './editor';
import * as _ from 'lodash';

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
