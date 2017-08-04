
import {
  JsonFormsRenderer,
  JsonSchema,
  rankWith,
  TreeMasterDetailRenderer,
  uiTypeIs
} from 'jsonforms';
declare let $;

@JsonFormsRenderer({
  selector: 'jsonforms-material-tree',
  tester: rankWith(2, uiTypeIs('MasterDetailLayout'))
})
class MaterializedTreeMasterDetailRenderer extends TreeMasterDetailRenderer {

  protected renderDetail(element: Object, label: HTMLLIElement, schema: JsonSchema) {
    super.renderDetail(element, label, schema);

    // init select
    setTimeout(() =>
      $('select').material_select(),
      100);
  }
}
