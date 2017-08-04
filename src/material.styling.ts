import { JsonForms, Style } from 'jsonforms';
declare let $;

export const applyMaterialStyle = () => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'button',
      classNames: ['btn', 'waves-effect', 'waves-light']
    },
    {
      name: 'array.button',
      classNames: ['btn-floating', 'waves-effect', 'waves-light', 'array-button']
    },
    {
      name: 'array.layout',
      classNames: ['z-depth-3']
    },
    {
      name: 'group.layout',
      classNames: ['z-depth-3']
    },
    {
      name: 'group.label',
      classNames: ['group.label']
    },
    {
      name: 'collection',
      classNames: ['collection']
    },
    {
      name: 'item',
      classNames: ['collection-item']
    },
    {
      name: 'item-active',
      classNames: ['active']
    },
    {
      name: 'horizontal-layout',
      classNames: ['row']
    },
    {
      name: 'json-forms',
      classNames: ['container']
    }
  ]);

  JsonForms.stylingRegistry.register({
    name: 'horizontal-layout-item',
    classNames: childrenSize => {
      const colSize = Math.floor(12 / childrenSize[0]);

      return ['col', `s${colSize}`];
    }
  } as Style);

  JsonForms.stylingRegistry.register({
    name: 'vertical-layout-item',
    classNames: ['vertical-layout-item']
  });
  JsonForms.stylingRegistry.deregister('select');

  // init selection combo box
  $('select').material_select();
};
