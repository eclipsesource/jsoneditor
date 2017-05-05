import {DataChangeListener} from 'jsonforms/dist/ts-build/core/data.service';
import {JsonForms} from 'jsonforms/dist/ts-build/json-forms';
import {JsonSchema} from 'jsonforms/dist/ts-build/models/jsonSchema';

export class JsonEditor extends HTMLElement {
  private master: HTMLElement;
  private detail: HTMLElement;
  private selected: HTMLLIElement;
  private dialog;
  private addingToRoot = false;
  private rootData: object;
  private dataSchema: JsonSchema;

  constructor() {
    super();
  }

  setRootData(rootData: object): void {
    this.rootData = rootData;
  }

  setSchema(dataSchema: JsonSchema): void {
    this.dataSchema = dataSchema;
  }
  connectedCallback(): void {
    // TODO connectedCallback
    this.render();
  }

  disconnectedCallback(): void {
    // TODO disconnectedCallback
  }

  private render(): HTMLElement {
    this.className = 'jsf-treeMasterDetail';

    // Create header
    const divHeader = document.createElement('div');
    divHeader.className = 'jsf-treeMasterDetail-header';

    // TODO check on schema instead of data
    // Adds a button to add root elements if possible
    // Possible only if there is an array of objects at the root level
    // if (Array.isArray(this.rootData)) {
    //   const button = document.createElement('button');
    //   button.textContent = 'Add to root';
    //
    //   button.onclick = (ev: Event) => {
    //     const newData = {};
    //     this.addingToRoot = true;
    //     const length = (<Array<object>>this.rootData).push(newData);
    //     this.expandObject(newData, <HTMLUListElement>this.master.firstChild, this.dataSchema.items,
    //       toDelete => this.rootData.splice(length - 1, 1));
    //     this.addingToRoot = false;
    //   };
    //   divHeader.appendChild(button);
    // }

    this.appendChild(divHeader);

    // main div for tree
    const div = document.createElement('div');
    div.className = 'jsf-treeMasterDetail-content';
    this.master = document.createElement('div');
    this.master.className = 'jsf-treeMasterDetail-master';
    div.appendChild(this.master);

    // detail div for properties
    this.detail = document.createElement('div');
    this.detail.className = 'jsf-treeMasterDetail-detail';
    div.appendChild(this.detail);

    this.appendChild(div);
    this.dialog = document.createElement('dialog');
    const title = document.createElement('label');
    title.innerText = 'Select the Item to create:';
    this.dialog.appendChild(title);
    const dialogContent = document.createElement('div');
    dialogContent.classList.add('content');
    this.dialog.appendChild(dialogContent);
    const dialogClose = document.createElement('button');
    dialogClose.innerText = 'Close';
    dialogClose.onclick = () => this.dialog.close();
    this.dialog.appendChild(dialogClose);
    this.appendChild(this.dialog);
    this.renderFull();
    return this;
  }

  // Render the tree and select the first element
  private renderFull(): void {
    this.renderMaster(this.dataSchema);
    this.selectFirstElement();
  }

  // Select the (first) root element in the tree
  private selectFirstElement(): void {
    const arrayData = this.rootData;
    if (arrayData !== undefined && arrayData !== null) {
      let firstChild = arrayData;
      let schema = this.dataSchema;
      if (Array.isArray(firstChild)) {
        firstChild = firstChild[0];
        schema = schema.items;
      }
      this.renderDetail(firstChild, <HTMLLIElement>this.master.firstChild.firstChild, schema);
    }
  }

  // Render the tree
  private renderMaster(schema: JsonSchema): void {
    if (this.master.lastChild !== null) {
      this.master.removeChild(this.master.lastChild);
    }
    const rootData = this.rootData;
    const ul = document.createElement('ul');
    if (schema.items !== undefined) {
      this.expandArray(<Array<object>>rootData, ul, <JsonSchema>schema.items);
    } else {
      this.expandObject(rootData, ul, schema, null);
    }
    this.master.appendChild(ul);
  }

  private expandArray(data: Array<Object>, parent: HTMLUListElement, schema: JsonSchema): void {
    if (data === undefined || data === null) {
      return;
    }
    data.forEach((element, index) => {
      this.expandObject(element, parent, schema, toDelete => data.splice(index, 1));
    });
  }

  private getArrayProperties(schema: JsonSchema): Array<string> {
    return Object.keys(schema.properties).filter(key => schema.properties[key].items !== undefined
      && schema.properties[key].items['type'] === 'object');
  }

  // Returns a function that produces a name for an object
  private getNamingFunction(schema: JsonSchema): (element: Object) => string {
    const namingKeys = Object.keys(schema.properties).filter(key => key === 'id' || key === 'name');
    if (namingKeys.length !== 0) {
      return (element) => element[namingKeys[0]];
    }
    return JSON.stringify;
  }

  private addElement(key: string, data: Object, schema: JsonSchema, li: HTMLLIElement): void {
    if (data[key] === undefined) {
      data[key] = [];
    }
    const childArray = data[key];
    const newData = {};
    const length = childArray.push(newData);
    const subChildren = li.getElementsByTagName('ul');
    let childParent;
    if (subChildren.length !== 0) {
      childParent = subChildren.item(0);
    } else {
      childParent = document.createElement('ul');
      li.appendChild(childParent);
    }
    this.expandObject(newData, childParent, schema.properties[key].items,
      toDelete => childArray.splice(length - 1, 1));
  }

  private expandObject(data: Object, parent: HTMLUListElement, schema: JsonSchema,
      deleteFunction: (element: Object) => void): void {
    const li = document.createElement('li');
    const div = document.createElement('div');
    const span = document.createElement('span');
    span.classList.add('label');
    span.onclick = (ev: Event) => this.renderDetail(data, li, schema);
    const spanText = document.createElement('span');
    spanText.textContent = this.getNamingFunction(schema)(data);
    span.appendChild(spanText);
    div.appendChild(span);
    if (this.getArrayProperties(schema).length !== 0) {
      const spanAdd = document.createElement('span');
      spanAdd.classList.add('add');
      spanAdd.onclick = (ev: Event) => {
        ev.stopPropagation();
        const content = this.dialog.getElementsByClassName('content')[0];
        while (content.firstChild) {
          (<Element>content.firstChild).remove();
        }
        this.getArrayProperties(schema).forEach(key => {
          const button = document.createElement('button');
          button.innerText = key;
          button.onclick = () => {
            this.addElement(key, data, schema, li);
            this.dialog.close();
          };
          content.appendChild(button);
        });
        this.dialog.showModal();
      };
      spanAdd.textContent = '\u2795';
      span.appendChild(spanAdd);
    }
    if (deleteFunction !== null) {
      const spanRemove = document.createElement('span');
      spanRemove.classList.add('remove');
      spanRemove.onclick = (ev: Event) => {
        ev.stopPropagation();
        deleteFunction(data);
        li.remove();
        if (this.selected === li) {
          this.selectFirstElement();
        }
      };
      spanRemove.textContent = '\u274C';
      span.appendChild(spanRemove);
    }
    li.appendChild(div);

    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        this.renderChildren(data[key], schema.properties[key].items, li, key);
      }
    });

    parent.appendChild(li);
  }

  private findRendererChildContainer(li: HTMLLIElement, key: string): HTMLUListElement {
    let ul: HTMLUListElement;
    const children = li.children;
    for (let i = 0; i < children.length; i++) {
      const child = children.item(i);
      if (child.tagName === 'UL' && child.getAttribute('children') === key) {
        ul = <HTMLUListElement>child;
      }
    }
    return ul;
  }

  private renderChildren
    (array: Array<Object>, schema: JsonSchema, li: HTMLLIElement, key: string): void {
    let ul: HTMLUListElement = this.findRendererChildContainer(li, key);
    if (ul === undefined) {
      ul = document.createElement('ul');
      ul.setAttribute('children', key);
      li.appendChild(ul);
    } else {
      while (ul.firstChild) {
        (<Element>ul.firstChild).remove();
      }
    }
    this.expandArray(array, ul, schema);
  }

  /*
    Render an element's details with JsonForms.
  */
  private renderDetail(element: Object, label: HTMLLIElement, schema: JsonSchema): void {
    if (this.detail.lastChild !== null) {
      this.detail.removeChild(this.detail.lastChild);
    }
    if (this.selected !== undefined) {
      this.selected.classList.toggle('selected');
    }
    label.classList.toggle('selected');
    this.selected = label;

    const jsonForms = <JsonForms>document.createElement('json-forms');
    jsonForms.data = element;
    jsonForms.dataSchema = schema;
    this.detail.appendChild(jsonForms);
  }
}

customElements.define('json-editor', JsonEditor);
