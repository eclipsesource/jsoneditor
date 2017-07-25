// import { Renderer, JsonFormsRenderer, rankWith, schemaMatches, RankedTester, Runtime,
//   RUNTIME_TYPE, BaseControl, resolveSchema, ControlElement} from 'jsonforms';
//
// export const labelRendererTester: RankedTester = rankWith(2, schemaMatches(model => isReferenceModel(model)));
// @JsonFormsRenderer({
//   selector: 'jsonforms-ecore-link',
//   tester: labelRendererTester
// })
// class LinkRenderer extends BaseControl<HTMLSelectElement> {
//   private options: Array<any>;
//   protected configureInput(input: HTMLSelectElement): void {
//     this.options = [];
//     // const model = <ReferenceModel>resolveSchema(this.dataModel, (<ControlElement>this.uischema).scope.$ref);
//     // const pathArray = <Array<string>>model.href.split('/');
//     const relevantDatas =
//
//     <Array<any>>pathArray.slice(1,pathArray.length-1).reduce((prev, cur) => {
//       if(cur === '#') {
//         return prev;
//       }
//       return prev[cur];
//     }, window['ecore-data']);
//     relevantDatas.forEach((optionValue,index) => {
//       const option = document.createElement('option');
//       option.value = index.toString();
//       option.label = optionValue['name'];
//       input.appendChild(option);
//     });
//     input.classList.add('form-control');
//   }
//   protected get valueProperty(): string {
//     return 'value';
//   }
//   protected get inputChangeProperty(): string {
//     return 'onchange';
//   }
//   protected get inputElement(): HTMLSelectElement {
//     return document.createElement('select');
//   }
//   protected convertModelValue(value: any): any {
//     return (value === undefined || value === null) ? undefined : value.toString();
//   }
//   protected convertInputValue(value: any): any {
//     return parseInt(value);
//   }
// }
