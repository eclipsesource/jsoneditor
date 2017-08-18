/* tslint:disable:no-invalid-this */
import { JsonForms, JsonSchema } from 'jsonforms';
import '../src/jsoneditor';
import './ereference.renderer';
import './eattribute.renderer';
import { JsonEditor } from '../src/jsoneditor';
import { Editor } from '../src/editor';
import { imageProvider, labelProvider, modelMapping } from './ecore-config';

import {ecore_schema} from './schema';
import {attributeView, eclass_view, datatype_view, eReferenceView, enum_view, epackage_view} from './uischema';

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
      register(attributeView, 'http://www.eclipse.org/emf/2002/Ecore#//EAttribute');
      register(eclass_view, 'http://www.eclipse.org/emf/2002/Ecore#//EClass');
      register(datatype_view, 'http://www.eclipse.org/emf/2002/Ecore#//EDataType');
      register(enum_view, 'http://www.eclipse.org/emf/2002/Ecore#//EEnum');
      register(epackage_view, 'http://www.eclipse.org/emf/2002/Ecore#//EPackage');
      register(eReferenceView, 'http://www.eclipse.org/emf/2002/Ecore#//EReference');
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
    this.editor.schema = ecore_schema;

    JsonForms.config.setIdentifyingProp('_id');
    this.editor.data = this.dataObject;
    this.appendChild(this.editor);
  }
}

// method to register ui schemas
const register = (uischema, uri) => {
  JsonForms.uischemaRegistry.register(uischema, (schema, data) =>
    data.eClass === uri || schema.properties !== undefined
    && schema.properties.eClass !== undefined
    && schema.properties.eClass.default === uri ? 2 : -1);
};

if (!customElements.get('ecore-editor')) {
  customElements.define('ecore-editor', EcoreEditor);
}
