import * as _ from 'lodash';
import {
  and,
  BaseControl,
  ControlElement,
  JsonForms,
  JsonFormsRenderer,
  RankedTester,
  rankWith, ReferenceProperty, schemaTypeIs,
  uiTypeIs,
} from 'jsonforms';
import { globalData } from './index';

export abstract class ETypeControl extends BaseControl<HTMLSelectElement> {

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

  // protected convertInputValue(value: any): any {
  //   console.log('converted input value', value);
  //   return value;
  // }

  protected abstract addOptions(input): void;
}
