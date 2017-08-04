/* tslint:disable:no-invalid-this */
import * as _ from 'lodash';
import * as Ajv from 'ajv';
import './ereference.renderer';
import './eattribute.renderer';
import './materialized.tree.renderer';
import './jsoneditor';
import { applyMaterialStyle } from './material.styling';
import { EcoreEditor } from './ecore-editor';
declare let $;
export * from './jsoneditor';
export * from './ecore-editor';

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
      } else {
        alert('Loaded data does not adhere to the specified schema.');
        console.error('Loaded data does not adhere to the specified schema.');

        return;
      }
    }
  };

  reader.readAsText(file);
};

window.onload = () => {
  const editor = document.createElement('ecore-editor') as EcoreEditor;

  // create hidden file input element
  const fileInput = document.createElement('input') as HTMLInputElement;
  fileInput.type = 'file';
  fileInput.style.display = 'none';
  fileInput.addEventListener('change', fileInputHandler(editor));

  const exportButton = document.getElementById('export-data-button') as HTMLButtonElement;
  exportButton.onclick = () => {
    prompt('Model Data', JSON.stringify(editor.data, null, 2));
  };

  // button triggering the hidden input element - only activate after schemas was loaded
  const uploadButton = document.getElementById('upload-data-button');
  uploadButton.onclick = () => {
    fileInput.click();
  };

  editor.data = {};
  document.getElementById('editor').appendChild(editor);

  applyMaterialStyle();
};
