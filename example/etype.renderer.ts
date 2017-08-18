import * as _ from 'lodash';
import { ReferenceControl } from 'jsonforms';
import { EcoreEditor } from './ecore-editor';

const labelProperty = 'name';

export abstract class ETypeControl extends ReferenceControl {

  protected getLabelProperty(): string {
    return labelProperty;
  }
}
