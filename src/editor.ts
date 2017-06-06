import {DataChangeListener} from 'jsonforms/dist/ts-build/core/data.service';
import {JsonForms} from 'jsonforms/dist/ts-build/json-forms';
import {JsonSchema} from 'jsonforms/dist/ts-build/models/jsonSchema';
import {SchemaExtractor} from './parser/schema_extractor';
import {ItemModel, MultipleItemModel, DummyModel, ReferenceModel, isItemModel,
  isMultipleItemModel, isReferenceModel, isDummyModel} from './parser/item_model';
import {extractSchemaFromModel} from './util';

export class JsonEditor extends HTMLElement {
  private master: HTMLElement;
  private detail: HTMLElement;
  private selected: HTMLLIElement;
  private dialog;
  private addingToRoot = false;
  private rootData: object;
  // private dataSchema: JsonSchema;
  private parser: SchemaExtractor;
  private rootModel: ItemModel|MultipleItemModel|ReferenceModel;
  private connected: boolean;

  constructor() {
    super();
  }

  setRootData(rootData: object): void {
    this.rootData = rootData;
  }

  setSchema(dataSchema: JsonSchema): void {
    let parser: SchemaExtractor = new SchemaExtractor(dataSchema);
    parser.extract().then(result => {
      if (isDummyModel(result) || result === undefined || result === null) {
        console.log('No valid model could be parsed from the given JsonSchema.');
        return;
      }
      this.rootModel = result;
      console.log('Successfully parsed JSON schema');
      this.render();
    });
  }

  connectedCallback(): void {
    this.connected = true;
    this.render();
  }

  disconnectedCallback(): void {
    this.connected = false;
  }

  private render(): HTMLElement {
    // Only render if the editor was connected and a data schema set
    if (!this.connected || this.rootModel === undefined || this.rootModel === null) {
      return;
    }

    this.className = 'jsf-treeMasterDetail';

    // Create header
    const divHeader = document.createElement('div');
    divHeader.className = 'jsf-treeMasterDetail-header';

    // check on schema instead of data
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
    //     this.expandObject(newData, <HTMLUListElement>this.master.firstChild,
    //       this.dataSchema.items, toDelete => this.rootData.splice(length - 1, 1));
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
    this.renderMaster(this.rootModel);
    this.selectFirstElement();
  }

  // Select the (first) root element in the tree
  private selectFirstElement(): void {
    const arrayData = this.rootData;
    if (arrayData !== undefined && arrayData !== null) {
      const helper = (innerModel: ItemModel|MultipleItemModel|ReferenceModel) => {
        if (isItemModel(innerModel)) {
          let firstChild = arrayData;
          let schema = innerModel.schema;
          if (Array.isArray(firstChild)) {
            firstChild = firstChild[0];
            schema = schema.items;
          }
          this.renderDetail(firstChild, <HTMLLIElement>this.master.firstChild.firstChild, schema);
        } else if (isMultipleItemModel(innerModel)) {
          // TODO selectFirstElement for MultipleItemModel
        } else if (isReferenceModel(innerModel)) {
          helper(innerModel.targetModel);
        }
      };

      helper(this.rootModel);
    }
  }

  // Render the tree
  private renderMaster(model: ItemModel|MultipleItemModel|ReferenceModel): void {
    if (this.master.lastChild !== null) {
      this.master.removeChild(this.master.lastChild);
    }
    const rootData = this.rootData;
    const ul = document.createElement('ul');

    const renderModel = (innerModel: ItemModel|MultipleItemModel|ReferenceModel) => {
      if (isItemModel(innerModel)) {
        if (innerModel.schema.items !== undefined) {
          // the items are available as a droppoint with key 'array'
          this.expandArray(<Array<object>>rootData, ul, innerModel.dropPoints['array']);
        } else {
          this.expandObject(rootData, ul, innerModel, null);
        }
      } else if (isMultipleItemModel(innerModel)) {
        // TODO handle multiple item model when necessary
      } else if (isReferenceModel(innerModel)) {
          renderModel(innerModel.targetModel);
      }
    };

    renderModel(model);

    this.master.appendChild(ul);
  }

  private expandArray(data: Array<Object>, parent: HTMLUListElement,
    model: ItemModel|MultipleItemModel|ReferenceModel): void {

    if (data === undefined || data === null) {
      return;
    }
    const expandModel = (innerModel: ItemModel|MultipleItemModel|ReferenceModel)  => {
      let schema;
      if (isItemModel(model)) {
        schema = model.schema;
      } else if (isMultipleItemModel(model)) {
        // TODO handle multiple item model
      } else if (isReferenceModel(model)) {
        expandModel(model.targetModel);
      }
      data.forEach((element, index) => {
        this.expandObject(element, parent, innerModel, toDelete => data.splice(index, 1));
      });
    };

    expandModel(model);
  }

  /**
  * Returns the names of all properties of type array.
  */
  private getArrayProperties(model: ItemModel|MultipleItemModel|ReferenceModel): Array<string> {
    if (isItemModel(model)) {
      return Object.keys(model.dropPoints);
    } else if (isMultipleItemModel(model)) {
      // TODO get array properties for MultipleItemModel
      return undefined;
    } else if (isReferenceModel(model)) {
      return this.getArrayProperties(model.targetModel);
    }
    // return Object.keys(schema.properties).filter(key =>
    //   schema.properties[key].items !== undefined
    //   && schema.properties[key].items['type'] === 'object');
  }

  /**
   * Returns a function that produces a name for a data object
   * defined by the given model
   */
  private getNamingFunction(model: ItemModel|MultipleItemModel|ReferenceModel)
    : (element: Object) => string {
    if (isItemModel(model)) {
      if (model.schema.properties !== undefined && model.schema.properties !== null) {
        const namingKeys = Object.keys(model.schema.properties)
          .filter(key => key === 'id' || key === 'name' || key === 'identifier');
        if (namingKeys !== undefined && namingKeys !== null && namingKeys.length !== 0) {
          return (element) => element[namingKeys[0]];
        }
      }
      return (element) => model.label + JSON.stringify(element);
    } else if (isReferenceModel(model)) {
      return this.getNamingFunction(model.targetModel);
    }
    return JSON.stringify;
  }

  /**
   * Adds a new element for the property key to the object data.
   *
   * @param key The property that the new element is added to
   * @param data The data object that the new element is added to
   * @param model The model representing the type of the element to add
   */
  private addElement(key: string, data: Object, model: ItemModel|MultipleItemModel|ReferenceModel,
    li: HTMLLIElement): void {
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

    const expandHelper = (targetModel) => {
      if (isItemModel(targetModel)) {
        this.expandObject(newData, childParent, targetModel,
          toDelete => childArray.splice(length - 1, 1));
      } else if (isMultipleItemModel(targetModel)) {
        // TODO multiple item model
      } else if (isReferenceModel(targetModel)) {
        expandHelper(targetModel.targetModel);
      }
    };
    expandHelper(model);
  }

  /**
   * Renders the given data object as a child of the parent.
   */
  private expandObject(data: Object, parent: HTMLUListElement,
    model: ItemModel|MultipleItemModel|ReferenceModel,
//    schema: JsonSchema,
    deleteFunction: (element: Object) => void): void {

    const li = document.createElement('li');
    const div = document.createElement('div');
    const span = document.createElement('span');
    span.classList.add('label');
    // TODO get correct schema for multi model
    let schema: JsonSchema = extractSchemaFromModel(model);
    span.onclick = (ev: Event) => this.renderDetail(data, li, schema);
    const spanText = document.createElement('span');
    spanText.classList.add('jse-tree-element-text');
    spanText.textContent = this.getNamingFunction(model)(data);
    span.appendChild(spanText);
    div.appendChild(span);
    if (this.getArrayProperties(model).length !== 0) {
      const spanAdd = document.createElement('span');
      spanAdd.classList.add('add');
      spanAdd.onclick = (ev: Event) => {
        ev.stopPropagation();
        const content = this.dialog.getElementsByClassName('content')[0];
        while (content.firstChild) {
          (<Element>content.firstChild).remove();
        }
        this.getArrayProperties(model).forEach(key => {
          if (!isItemModel(model)) {
            return;
          }
          const droppoint = model.dropPoints[key];
          const addButtons = (buttonModel, multi = false) => {
            if (isItemModel(buttonModel)) {
              const button = document.createElement('button');
              // set unique name in case a MultipleItemModel was resolved earlier
              button.innerText = multi ? key + '/' + buttonModel.label : key;
              button.onclick = () => {
                this.addElement(key, data, buttonModel, li);
                this.dialog.close();
              };
              content.appendChild(button);
            } else if (isMultipleItemModel(buttonModel)) {
              buttonModel.models.forEach(m => addButtons(m, true));
            } else if (isReferenceModel(buttonModel)) {
              addButtons(buttonModel.targetModel, multi);
            }
          };
          addButtons(droppoint);
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
        const renderHelper = (targetModel) => {
          if (isItemModel(targetModel)) {
            this.renderChildren(data[key], targetModel.dropPoints[key] , li, key);
          } else if (isMultipleItemModel(targetModel)) {
            // TODO multiple item model
          } else if (isReferenceModel(targetModel)) {
            renderHelper(targetModel.targetModel);
          }
        };
        renderHelper(model);
      }
    });

    parent.appendChild(li);
  }

  private executeOnTargetModel(model: ItemModel|MultipleItemModel|ReferenceModel,
    executeFunction: (targetModel: ItemModel|MultipleItemModel|ReferenceModel) => void): void {

    if (isItemModel(model)) {
      executeFunction(model);
    } else if (isMultipleItemModel(model)) {
      // TODO handle multiple item model when necessary
    } else if (isReferenceModel(model)) {
        executeFunction(model.targetModel);
    }
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

  private renderChildren(array: Array<Object>, model: ItemModel|MultipleItemModel|ReferenceModel,
      li: HTMLLIElement, key: string): void {
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
    this.expandArray(array, ul, model);
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
