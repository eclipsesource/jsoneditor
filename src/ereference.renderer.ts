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

export const eReferenceRendererTester: RankedTester =
  rankWith(
    3,
    and(
      uiTypeIs('Control'),
      optionIs('id', 'eReference')
    )
  );

@JsonFormsRenderer({
  selector: 'jsonforms-ereference-control',
  tester: eReferenceRendererTester
})
class EReferenceControl extends ETypeControl {

  protected addOptions(input) {
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
