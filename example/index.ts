/* tslint:disable:no-invalid-this */
import * as _ from 'lodash';
import * as Ajv from 'ajv';
import './ereference.renderer';
import './eattribute.renderer';
import './materialized.tree.renderer';
import '../src/jsoneditor';
import {
  configureDownloadButton,
  configureExportButton,
  configureUploadButton,
  createExportDataDialog
} from './toolbar';
import { applyMaterialStyle } from './material.styling';
import { EcoreEditor } from './ecore-editor';
declare let $;

window.onload = () => {
  const editor = document.createElement('ecore-editor') as EcoreEditor;
  const exportDialog = createExportDataDialog();
  document.body.appendChild(exportDialog);

  const exportButton = document.getElementById('export-data-button') as HTMLButtonElement;
  configureExportButton(editor, exportButton, exportDialog);

  // button triggering the hidden input element - only activate after schemas was loaded
  const uploadButton = document.getElementById('upload-data-button') as HTMLButtonElement;
  configureUploadButton(editor, uploadButton);

  // configure button to download model data.
  const downloadButton = document.getElementById('download-data-button') as HTMLButtonElement;
  configureDownloadButton(editor, downloadButton);

  editor.data = {};
  document.getElementById('editor').appendChild(editor);

  applyMaterialStyle();
};
