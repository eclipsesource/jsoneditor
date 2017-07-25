import 'jsongraph';
import './jsongraph_ecore';
import {JsonFormsHolder} from 'jsonforms';

const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
   const uischemas = JSON.parse(this.responseText);
   register(uischemas.attribute_view, "http://www.eclipse.org/emf/2002/Ecore#//EAttribute");
   register(uischemas.eclass_view, "http://www.eclipse.org/emf/2002/Ecore#//EClass");
   register(uischemas.datatype_view, "http://www.eclipse.org/emf/2002/Ecore#//EDataType");
   register(uischemas.enum_view, "http://www.eclipse.org/emf/2002/Ecore#//EEnum");
   register(uischemas.epackage_view, "http://www.eclipse.org/emf/2002/Ecore#//EPackage");
   register(uischemas.reference_view, "http://www.eclipse.org/emf/2002/Ecore#//EReference");

  }
};
xhttp.open("GET", "http://localhost:3001/uischema.json", true);
xhttp.send();

const register = (uischema, uri) => {
  JsonFormsHolder.uischemaRegistry.register(uischema, (schema, data) =>
    data.eClass === uri || schema.properties!==undefined && schema.properties.eClass!==undefined
    && schema.properties.eClass.default===uri? 2 : -1);
}
window.onload =() => {
  const dataURL = "http://localhost:3004/ecore";
  // const dataURL = "http://localhost:3004/task";
  const ecore = document.createElement('jsongraph-ecore');
  const saveDataButton = document.getElementById('saveData');
  saveDataButton.onclick = () => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    };
    xhttp.open("PUT", dataURL, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(ecore['data']));
  };
  const loadData = () => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

        ecore['data'] = JSON.parse(this.responseText);
        document.body.appendChild(ecore);
      }
    };
    xhttp.open("GET", dataURL, true);
    xhttp.send();
  };
  loadData();
}
