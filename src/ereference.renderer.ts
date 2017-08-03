import * as _ from 'lodash';
import {
  and,
  BaseControl,
  ControlElement,
  JsonForms,
  JsonFormsRenderer, optionIs,
  RankedTester,
  rankWith, ReferenceProperty, schemaTypeIs,
  uiTypeIs,
} from 'jsonforms';
import { globalData } from './index';

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
class EReferenceControl extends BaseControl<HTMLSelectElement> {

  private options: any[];

  protected configureInput(input: HTMLSelectElement): void {
    this.addOptions(input);
  }

  protected get valueProperty(): string {
    return 'value';
  }

  protected get inputChangeProperty(): string {
    return 'onchange';
  }

  protected createInputElement(): HTMLSelectElement {
    return document.createElement('select');
  }

  protected convertModelValue(value: any): any {
    return (value === undefined || value === null) ? undefined : value.toString();
  }

  protected convertInputValue(value: any): any {
    console.log('converted input value', value);
    return value;
  }

  private addOptions(input) {
    const eReferenceSchema = this.dataSchema;
    const eTypeRefProp: ReferenceProperty =
      _.head(JsonForms.schemaService.getReferenceProperties(eReferenceSchema));

    const referencees = eTypeRefProp.findReferenceTargets(globalData);

    referencees.forEach((referencee, index) => {
      const option = document.createElement('option');
      console.log('referencee', referencee);
      option.value = referencee['_id'];
      option.label = referencee['name'];
      input.appendChild(option);
    });

    input.classList.add('form-control');
  }
}
