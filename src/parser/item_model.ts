import {JsonSchema} from 'jsonforms/dist/ts-build/models/jsonSchema';

export interface DummyModel {}
export interface ItemModel {
  label: string;
  // fullschema: JsonSchema;
  schema: JsonSchema;
  dropPoints: {[property: string]: ItemModel|MultipleItemModel|ReferenceModel};
}
export interface MultipleItemModel {
  models: Array<ItemModel>;
  type: MULTIPLICITY_TYPES;
}
export interface ReferenceModel {
  label: string;
  href: string;
  schema: JsonSchema;
  targetModel: ItemModel|MultipleItemModel|ReferenceModel;
}
export enum MULTIPLICITY_TYPES {
  ALL_OF, ANY_OF, ONE_OF, NOT
}

export function isItemModel
  (model: ItemModel|MultipleItemModel|DummyModel|ReferenceModel): model is ItemModel {
    return (<ItemModel>model).dropPoints !== undefined;
}
export function isMultipleItemModel
  (model: ItemModel|MultipleItemModel|DummyModel|ReferenceModel): model is MultipleItemModel {
    return (<MultipleItemModel>model).type !== undefined;
}
export function isDummyModel
  (model: ItemModel|MultipleItemModel|DummyModel|ReferenceModel): model is DummyModel {
    return Object.keys(model).length === 1;
}
export function isReferenceModel
  (model: ItemModel|MultipleItemModel|DummyModel|ReferenceModel): model is ReferenceModel {
    return (<ReferenceModel>model).href !== undefined;
}
