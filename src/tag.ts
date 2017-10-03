class Tag {
  constructor(private name: string, private namespace?: string) {
    this.element = !!namespace ?
      <HTMLElement>document.createElementNS(namespace, name) :
      document.createElement(this.name);
  }

  public get native() { return this.element; }

  public text(): string;
  public text(value: string): this;
  public text(value?: string): this | string {
    if (isUndefined(value)) {
      return this.element.textContent;
    } else {
      this.element.textContent = value;
      return this;
    }
  }

  public val(): string;
  public val(value: string | number): this;
  public val(value?: string | number): string | this {
    if (isUndefined(value)) {
      return (<HTMLInputElement>this.element).value;
    } else {
      (<HTMLInputElement>this.element).value = isString(value) ? value : value.toString();
      return this;
    }
  }

  public css(): CSSStyleDeclaration;
  public css(name: string): string;
  public css(name: string, value: string | number): this;
  public css(properties: { [key: string]: string | number }): this;
  public css(
    nameOrProperties?: string | { [key: string]: string | number },
    value?: string | number
  ): CSSStyleDeclaration | string | this {
    if (isUndefined(nameOrProperties)) {
      return window.getComputedStyle(this.element);
    } else {
      if (isString(nameOrProperties)) {
        if (isUndefined(value)) {
          return window.getComputedStyle(this.element)[nameOrProperties];
        } else {
          this.element.style[nameOrProperties] = isString(value) ? value : value.toString();
          return this;
        }
      } else {
        Object.keys(nameOrProperties).forEach(x => this.css(x, nameOrProperties[x]));
        return this;
      }
    }
  }

  public class(): string;
  public class(value: string): this;
  public class(value?: string): this | string {
    if (isUndefined(value)) {
      return this.element.className;
    } else {
      this.element.className = value;
      return this;
    }
  }

  public removeClass() {
    this.removeAttr("class");
    return this;
  }

  public attr(name: string): string;
  public attr(name: string, value: string): this;
  public attr(properties: { [key: string]: string }): this;
  public attr(
    nameOrProperties?: string | { [key: string]: string },
    value?: string
  ): this | string {
    if (isString(nameOrProperties)) {
      if (isUndefined(value)) {
        return this.element.getAttribute(nameOrProperties);
      } else {
        this.element.setAttribute(nameOrProperties, value);
        return this;
      }
    } else {
      Object.keys(nameOrProperties).forEach(x => this.attr(x, nameOrProperties[x]));
      return this;
    }
  }

  public removeAttr(name: string): this {
    this.element.removeAttribute(name);
    return this;
  }

  public append(...args: any[]): this {
    for (let x of args) {
      if (Array.isArray(x)) {
        this.append(...x);
      } else if (x instanceof Tag) {
        x.appendTo(this.element);
      } else {
        let data = isString(x) ? x : x.toString();
        let node = document.createTextNode(data);
        this.element.appendChild(node);
      }
    }
    return this;
  }

  public appendTo(target: Element): this;
  public appendTo(target: Tag): this;
  public appendTo(target: Element | Tag) {
    if (target instanceof Tag) {
      target.element.appendChild(this.element);
    } else {
      target.appendChild(this.element);
    }
    return this;
  }

  public detach(): this {
    let parent = this.element.parentNode;
    if (parent) {
      parent.removeChild(this.element);
    }
    return this;
  }

  public on(event: string, callback: (e: Event) => any): this {
    this.element.addEventListener(event, callback);
    this.eventListeners[event] = this.eventListeners[event] || [];
    this.eventListeners[event].push(callback);
    return this;
  }

  public off(event: string, callback?: (e: Event) => any): this {
    let callbacks = this.removeEventListeners(event, callback);
    callbacks.forEach(x => this.element.removeEventListener(event, x));
    return this;
  }

  private removeEventListeners(event: string, callback?: (e: Event) => any) {
    let callbacks = this.eventListeners[event] || [];
    if (isUndefined(callback)) {
      this.eventListeners[event] = [];
      return callbacks;
    } else {
      let index = callbacks.indexOf(callback);
      if (index !== -1) {
        return callbacks.splice(index, 1);
      } else {
        return [];
      }
    }
  }

  private element: HTMLElement = null;
  private eventListeners: { [event: string]: ((e: Event) => any)[] } = {};
}

const tag = (name: string, namespace?: string) => (...args: any[]): Tag => {
  let instance = new Tag(name, namespace);
  return instance.append(...args);
};

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

const h1 = tag("h1");
const h2 = tag("h2");
const h3 = tag("h3");
const h4 = tag("h4");
const h5 = tag("h5");
const h6 = tag("h6");
const p = tag("p");
const div = tag("div");
const span = tag("span");
const link = tag("link");
const a = tag("a");
const img = tag("img");
const input = tag("input");
const option = tag("option");
const textarea = tag("textarea");
const button = tag("button");
const select = tag("select");
const form = tag("form");
const table = tag("table");
const thead = tag("thead");
const tbody = tag("tbody");
const tfoot = tag("tfoot");
const tr = tag("tr");
const th = tag("th");
const td = tag("td");
const title = tag("title");
const time = tag("time");
const ul = tag("ul");
const li = tag("li");
const ol = tag("ol");