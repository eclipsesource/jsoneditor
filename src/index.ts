import 'jsonforms';
// import {JsonForms} from 'jsonforms/dist/ts-build/json-forms';
import  './editor';
import  {JsonEditor} from './editor';
// import {data} from './resource/sampledata';
// import {schema_no_refs as schema} from './resource/metaschema';
// import {schema_only_refs as schema} from './resource/metaschema';
// import {schema} from './resource/metaschema';
// import {data, schema} from './resource/dummy';
// import {data, schema} from './resource/minimal_array_ref';
import {schema, data} from './resource/recursion';

window.onload = () => {
  // const jsonForms = <JsonForms> document.createElement('json-forms');
  // jsonForms.data = {name: 'test'};
  // document.body.appendChild(jsonForms);
  const jsonEditor = <JsonEditor>document.createElement('json-editor');
  jsonEditor.setSchema(schema);
  jsonEditor.setRootData(data);
  document.body.appendChild(jsonEditor);
};
