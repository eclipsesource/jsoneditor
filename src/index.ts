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

/**
 * Creates and returns a dialog to display the editor's model data in a text area.
 */
const createExportDataDialog = () => {
  const dialog = document.createElement('dialog') as any;
  dialog.classList.add('export-data-dialog');
  const dialogContent  = document.createElement('div');
  dialogContent.classList.add('export-data-dialog-content');
  dialog.appendChild(dialogContent);
  const dialogTitle = document.createElement('label');
  dialogTitle.innerText = 'Model Data:';
  dialogTitle.classList.add('export-data-dialog-title');
  const textarea = document.createElement('textarea');
  textarea.classList.add('export-data-dialog-textarea');
  textarea.readOnly = true;

  const buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('export-data-dialog-buttons');
  const dialogClose = document.createElement('button');
  dialogClose.innerText = 'Close';
  dialogClose.classList.add('btn');
  dialogClose.onclick = () => {
    dialog.close();
  };
  const dialogCopy = document.createElement('button');
  dialogCopy.classList.add('btn');
  dialogCopy.innerText = 'Copy';
  dialogCopy.onclick = () => {
    document.execCommand('copy');
  };
  buttonsDiv.appendChild(dialogCopy);
  buttonsDiv.appendChild(dialogClose);
  dialogContent.appendChild(dialogTitle);
  dialogContent.appendChild(textarea);
  dialogContent.appendChild(buttonsDiv);

  return dialog;
};

window.onload = () => {
  const editor = document.createElement('ecore-editor') as EcoreEditor;
  const dialog = createExportDataDialog();
  document.body.appendChild(dialog);

  // create hidden file input element
  const fileInput = document.createElement('input') as HTMLInputElement;
  fileInput.type = 'file';
  fileInput.style.display = 'none';
  fileInput.addEventListener('change', fileInputHandler(editor));

  const exportButton = document.getElementById('export-data-button') as HTMLButtonElement;
  exportButton.onclick = () => {
    const json = JSON.stringify(editor.data, null, 2);
    const textarea = dialog.getElementsByTagName('textarea').item(0) as HTMLTextAreaElement;
    textarea.textContent = json;
    dialog.showModal();
    textarea.focus();
    textarea.select();
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
