/* tslint:disable:no-invalid-this */
import * as _ from 'lodash';
import './ereference.renderer';
import './jsoneditor';
import { JsonEditor } from './jsoneditor';
import { JsonForms } from 'jsonforms';
import { imageProvider, labelProvider, modelMapping } from './ecore-config';
import * as Ajv from 'ajv';

export * from './jsoneditor';

const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState === 4 && this.status === 200) {
    const uischemas = JSON.parse(this.responseText);

    register(uischemas.attribute_view, 'http://www.eclipse.org/emf/2002/Ecore#//EAttribute');
    register(uischemas.eclass_view, 'http://www.eclipse.org/emf/2002/Ecore#//EClass');
    register(uischemas.datatype_view, 'http://www.eclipse.org/emf/2002/Ecore#//EDataType');
    register(uischemas.enum_view, 'http://www.eclipse.org/emf/2002/Ecore#//EEnum');
    register(uischemas.epackage_view, 'http://www.eclipse.org/emf/2002/Ecore#//EPackage');
    register(uischemas.reference_view, 'http://www.eclipse.org/emf/2002/Ecore#//EReference');

  }
};
xhttp.open('GET', 'http://localhost:3001/uischema.json', true);
xhttp.send();

// method to register ui schemas
const register = (uischema, uri) => {
  JsonForms.uischemaRegistry.register(uischema, (schema, data) =>
    data.eClass === uri || schema.properties !== undefined && schema.properties.eClass !== undefined
    && schema.properties.eClass.default === uri ? 2 : -1);
};

/*
 * Handler for a file input change event.
 * Loads the file, converts it to JSON and validates it against the editor's schema.
 * If these steps are successful, the loaded data is set in the editor.
 */
const fileInputHandler = editor => evt => {
  // triggered after a file was selected
  const target = evt.target as HTMLInputElement;
  const files = target.files;
  if (_.isEmpty(files) || files.length > 1) {
    return;
  }
  const file = files[0];
  const reader = new FileReader();

  // Callback when the file was loaded
  reader.onload = event => {
    if (reader.result === undefined || reader.result === null) {
      console.error('Could not read data');
    }
    let readData;
    try {
      readData = JSON.parse(reader.result);
    } catch (err) {
      alert('The selected file \'' + file.name + '\' does not contain valid JSON');
      console.error('The loaded file did not contain valid JSON: ' + err);

      return;
    }
    if (!_.isEmpty(readData)) {
      const ajv = new Ajv();
      const valid = ajv.validate(editor.schema, readData);
      if (valid) {
        editor.data = readData;
        globalData = readData;
      } else {
        alert('Loaded data does not adhere to the specified schema.');
        console.error('Loaded data does not adhere to the specified schema.');

        return;
      }
    }
  };

  reader.readAsText(file);
};

// TODO: remove global data object
export let globalData = {};

window.onload = () => {
  const editor = document.createElement('json-editor') as JsonEditor;

  // create hidden file input element
  const fileInput = document.createElement('input') as HTMLInputElement;
  fileInput.type = 'file';
  fileInput.style.display = 'none';
  fileInput.addEventListener('change', fileInputHandler(editor));

  // configure editor with labels, icons, and model mappings
  editor.setLabelMapping(labelProvider);
  editor.setImageMapping(imageProvider);
  editor.setModelMapping(modelMapping);

  // load schema from REST service. Activate load data button after it has been loaded
  const xhttp2 = new XMLHttpRequest();
  xhttp2.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      const schema = JSON.parse(this.responseText);
      editor.schema = schema;
      JsonForms.config.setIdentifyingProp("_id");
      editor.data = globalData;
      document.body.appendChild(editor);

      const exportButton = document.getElementById('export-data-button') as HTMLButtonElement;
      exportButton.onclick = () => {
        prompt('Model Data', JSON.stringify(editor.data, null, 2));
      };

      // button triggering the hidden input element - only activate after schemas was loaded
      const uploadButton = document.getElementById('upload-data-button');
      uploadButton.onclick = () => {
        fileInput.click();
      };
    }
  };
  xhttp2.open('GET', 'http://localhost:3001/schema.json', true);
  // xhttp.open("GET", "http://localhost:3001/task.schema.json", true);
  xhttp2.send();
};
