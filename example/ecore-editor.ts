/* tslint:disable:no-invalid-this */
import { JsonForms, JsonSchema } from 'jsonforms';
import '../src/jsoneditor';
import './ereference.renderer';
import './eattribute.renderer';
import { JsonEditor } from '../src/jsoneditor';
import { Editor } from '../src/editor';
import { imageProvider, labelProvider, modelMapping } from './ecore-config';
import { ecoreSchema } from './schema';
import {
  attributeView,
  datatypeView,
  eClassView,
  enumView,
  ePackageView,
  eReferenceView
} from './uischema';

export class EcoreEditor extends HTMLElement implements Editor {
  private dataObject: Object;
  public useLocalREST = false;
  private connected = false;
  private editor: JsonEditor;

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

  set data(data: Object) {
    this.dataObject = data;
    this.render();
  }

  get data(): Object {
    return this.dataObject;
  }

  get schema(): JsonSchema {
    if (this.editor !== undefined && this.editor !== null) {
      return this.editor.schema;
    }

    return undefined;
  }
  private registerUiSchemas(): void {
    this.editor.registerDetailSchema('#attribute', attributeView);
    this.editor.registerDetailSchema('#class', eClassView);
    this.editor.registerDetailSchema('#datatype', datatypeView);
    this.editor.registerDetailSchema('#enum', enumView);
    this.editor.registerDetailSchema('#package', ePackageView);
    this.editor.registerDetailSchema('#reference', eReferenceView);
  }

  private configureLabelMapping() {
    this.editor.setLabelMapping(labelProvider);
  }

  private configureImageMapping() {
    this.editor.setImageMapping(imageProvider);
  }

  private configureModelMapping() {
    // const callback = parsedResponse => {
    this.editor.setModelMapping(modelMapping);
    // };
    // this.loadFromRest('http', callback);
  }

  private render() {
    if (!this.connected || this.dataObject === undefined
        || this.dataObject === null) {
      return;
    }
    if (this.editor === undefined) {
      this.editor = document.createElement('json-editor') as JsonEditor;
    }

    this.configureImageMapping();
    this.configureLabelMapping();
    this.configureModelMapping();
    this.registerUiSchemas();
    this.editor.schema = ecoreSchema;

    JsonForms.config.setIdentifyingProp('_id');
    this.editor.data = this.dataObject;
    this.appendChild(this.editor);
  }
}

if (!customElements.get('ecore-editor')) {
  customElements.define('ecore-editor', EcoreEditor);
}
