function updateEcoreEditorData(element, data) {
  console.log("Initializing Ecore Editor Example...");
  if (element.firstChild){
    element.firstChild.remove();
  }

  var ecoreEditor = document.createElement('ecore-editor');
  ecoreEditor.data = data;

  element.appendChild(ecoreEditor);
}
