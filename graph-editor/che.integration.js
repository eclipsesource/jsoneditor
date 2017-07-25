function updateEcoreEditorData(element, data) {
    console.log("Initializing ECore editor...")
    var ecore = document.createElement('jsonforms-ecore');
    ecore.data = data;
    element.appendChild(ecore);
};
