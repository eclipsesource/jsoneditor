/* tslint:disable:no-invalid-this */
import { JsonForms, JsonSchema } from 'jsonforms';
import './jsoneditor';
import './eattribute.renderer';
import './ereference.renderer';
import { JsonEditor } from './jsoneditor';
import { Editor } from './editor';
import { imageProvider, labelProvider, modelMapping } from './ecore-config';

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
    const callback = uischemas => {
      register(uischemas.attribute_view, 'http://www.eclipse.org/emf/2002/Ecore#//EAttribute');
      register(uischemas.eclass_view, 'http://www.eclipse.org/emf/2002/Ecore#//EClass');
      register(uischemas.datatype_view, 'http://www.eclipse.org/emf/2002/Ecore#//EDataType');
      register(uischemas.enum_view, 'http://www.eclipse.org/emf/2002/Ecore#//EEnum');
      register(uischemas.epackage_view, 'http://www.eclipse.org/emf/2002/Ecore#//EPackage');
      register(uischemas.reference_view, 'http://www.eclipse.org/emf/2002/Ecore#//EReference');
    };
    this.loadFromRest('ecoreUiSchema', callback);
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

  private configureSchema() {
    const callback = parsedResponse => {
      this.editor.schema = parsedResponse;
    };
    this.loadFromRest('ecoreSchema', callback);
  }

  private loadFromRest(file: string, callback: (parsedResponse: Object) => void) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        const object = JSON.parse(this.responseText);
        callback(object);
      }
    };
    let url;
    if (this.useLocalREST) {
          const datahost = 'http://localhost:3001/';
          url = datahost + file + '.json';
        } else {
          const datahost = 'http://localhost:9090/services/staticecore/';
          url = datahost + file;
        }
    xhttp.open('GET', url, false);
    xhttp.send();
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
    this.configureSchema();

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
