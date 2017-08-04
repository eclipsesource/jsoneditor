/* tslint:disable:no-invalid-this */
import * as _ from 'lodash';
import './ereference.renderer';
import './eattribute.renderer';
import './materialized.tree.renderer';
import './jsoneditor';
import { JsonEditor } from './jsoneditor';
import { JsonForms, Style } from 'jsonforms';
import { imageProvider, labelProvider, modelMapping } from './ecore-config';
import * as Ajv from 'ajv';
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
  const editor = document.createElement('json-editor') as JsonEditor;

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
  xhttp2.open('GET', 'http://localhost:3001/schema.json', true);
  // xhttp.open("GET", "http://localhost:3001/task.schema.json", true);
  xhttp2.send();

  editor.data = {};
  document.body.appendChild(editor);

  material();
};


// TODO
const material = () => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'button',
      classNames: ['btn', 'waves-effect', 'waves-light']
    },
    {
      name: 'array.button',
      classNames: ['btn-floating', 'waves-effect', 'waves-light', 'array-button']
    },
    {
      name: 'array.layout',
      classNames: ['z-depth-3']
    },
    {
      name: 'group.layout',
      classNames: ['z-depth-3']
    },
    {
      name: 'group.label',
      classNames: ['group.label']
    },
    {
      name: 'collection',
      classNames: ['collection']
    },
    {
      name: 'item',
      classNames: ['collection-item']
    },
    {
      name: 'item-active',
      classNames: ['active']
    },
    {
      name: 'horizontal-layout',
      classNames: ['row']
    },
    {
      name: 'json-forms',
      classNames: ['container']
    }
  ]);

  JsonForms.stylingRegistry.register({
    name: 'horizontal-layout-item',
    classNames: childrenSize => {
      const colSize = Math.floor(12 / childrenSize[0]);

      return ['col', `s${colSize}`];
    }
  } as Style);

  JsonForms.stylingRegistry.register({
    name: 'vertical-layout-item',
    classNames: ['vertical-layout-item']
  });
  JsonForms.stylingRegistry.deregister('select');

  // init selection combo box
  $('select').material_select();
};
