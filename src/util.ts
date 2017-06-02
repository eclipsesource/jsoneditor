import {JsonSchema} from 'jsonforms/dist/ts-build/models/jsonSchema';
import {ItemModel, MultipleItemModel, DummyModel, ReferenceModel, isItemModel,
  isMultipleItemModel, isReferenceModel, isDummyModel} from './parser/item_model';

export function extractSchemaFromModel(model: ItemModel|MultipleItemModel|ReferenceModel): JsonSchema {
  if (isItemModel(model)) {
    return model.schema;
  } else if (isMultipleItemModel(model)) {
    // TODO multiple item model
    return undefined;
  } else if (isReferenceModel(model)) {
    return this.extractSchemaFromModel(model.targetModel);
  }
}

export function deepCopy<T>(object: T): T {
  return JSON.parse(JSON.stringify(object)) as T;
}
