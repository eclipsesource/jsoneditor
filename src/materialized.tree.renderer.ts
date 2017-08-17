
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

    // init selects and remove description option when the reference is already set
    setTimeout(() => {
        const selectList = $('select');
        for (const item of selectList) {
          const select = item as HTMLSelectElement;
          if (select.selectedIndex > 0) {
            select.options[0].remove();
          }
        }
        selectList.material_select();
      },       100);
  }
}
