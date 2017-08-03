import * as _ from 'lodash';
import {
  and,
  BaseControl,
  ControlElement,
  JsonForms,
  JsonFormsRenderer,
  optionIs,
  RankedTester,
  rankWith, ReferenceProperty, schemaTypeIs,
  uiTypeIs,
} from 'jsonforms';
import { ETypeControl } from './etype.renderer';
import { EcoreEditor } from './../ecore-editor/ecore-editor';

const identifyingProperty = '_id';
const labelProperty = 'name';

export const eAttributeRendererTester: RankedTester =
  rankWith(
    3,
    and(
      uiTypeIs('Control'),
      optionIs('id', 'eAttribute')
    )
  );

@JsonFormsRenderer({
  selector: 'jsonforms-eattribute-control',
  tester: eAttributeRendererTester
})
class EAttributeControl extends ETypeControl {

  private standardDatatypes = [
    'http://www.eclipse.org/emf/2002/Ecore#//EBoolean',
    'http://www.eclipse.org/emf/2002/Ecore#//EString',
    'http://www.eclipse.org/emf/2002/Ecore#//EDate',
    'http://www.eclipse.org/emf/2002/Ecore#//EInt',
    'http://www.eclipse.org/emf/2002/Ecore#//EDouble',
  ];

  protected addOptions(input) {
    // add standard emf datatypes
    this.standardDatatypes.forEach((datatype, index) => {
      const option = document.createElement('option');
      option.value = datatype;
      option.label = datatype;

      console.log('datatype option', option);
      input.appendChild(option);
    });

    // add datatypes defined in model
    const eReferenceSchema = this.dataSchema;
    const eTypeRefProp: ReferenceProperty =
      _.head(JsonForms.schemaService.getReferenceProperties(eReferenceSchema));

    const referencees = eTypeRefProp.findReferenceTargets(EcoreEditor.dataObject);

    referencees.forEach((referencee, index) => {
      const option = document.createElement('option');
      console.log('referencee', referencee);
      option.value = referencee[identifyingProperty];
      option.label = referencee[labelProperty];
      input.appendChild(option);
    });

    input.classList.add('form-control');
  }
}
