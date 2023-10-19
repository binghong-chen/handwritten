function processText(el) {
  return el.textContent.replace(
    /\{\{(.+?)\}\}/g,
    (expressWithBrace, expression) => `\${${expression}}` ?? expressWithBrace
  );
}

function processAttr(el, attrName) {
  if (!(el instanceof HTMLElement)) return;
  if (!el.hasAttribute(attrName)) return;
  const expression = el.getAttribute(attrName);
  el.removeAttribute(attrName);
  return expression;
}
function toClassList(classAttr) {
  if (!classAttr) return [];
  if (typeof classAttr === "string") return [classAttr];
  if (Array.isArray(classAttr)) return classAttr.map(toClassList);
  if (typeof classAttr === "object") {
    return toClassList(Object.keys(classAttr).filter((key) => classAttr[key]));
  }

  return [classAttr + ""];
}

function processAttrs(el) {
  const attrs = [];
  const events = [];
  const directives = [];
  el.getAttributeNames().forEach((attrName) => {
    for (let prefix of "@,v-on:".split(",")) {
      if (!attrName.startsWith(prefix)) continue;
      const expression = processAttr(el, attrName);
      events.push(
        `'${attrName.slice(prefix.length)}': {
            value: $event => {${expression}}, 
            expression: '${expression}'
          }`
      );
      return;
    }
    if (attrName.startsWith("v-")) {
      const expression = processAttr(el, attrName);
      directives.push(
        `'${attrName.slice(2)}': {
          value: ${expression ? expression : undefined}, 
          expression: ${JSON.stringify(expression)}
        }`
      );
      return;
    }
    if (attrName.startsWith(":")) {
      const expression = processAttr(el, attrName);
      attrs.push(
        `'${attrName}': {
          value: ${expression ? expression : undefined}, 
          expression: ${JSON.stringify(expression)}
        }`
      );
      return;
    }
    const expression = processAttr(el, attrName);
    attrs.push(
      `'${attrName}': {
        value: ${JSON.stringify(expression)},
        expression: ${JSON.stringify(expression)}
      }`
    );
  });
  return `{
    ${attrs.join(",\n")}
  },
  {
    ${events.join(",\n")}
  },
  {
    ${directives.join(",\n")}
  }`;
}

function processStyle(el, value) {
  const style = Object.keys(value)
    .map(
      (key) =>
        key.replace(/([A-Z])/g, (a, b) => "-" + b.toLowerCase()) +
        ":" +
        value[key]
    )
    .join("; ");
  el.setAttribute("style", style);
}

function processClass(el, value) {
  const classList = toClassList(value).flat();
  el.classList.add(...classList);
}

function processVIF(el) {
  const name = "v-if";
  if (!el.hasAttribute(name)) return;
  // 当 v-if 和 v-for 同时存在于一个元素上的时候，v-if 会首先被执行。请查看列表渲染指南获取更多细节。
  el.removeAttribute("v-for");

  let code = "";
  let expression = processAttr(el, "v-if");
  if (expression) {
    code += `if (${expression}) {
      return ${processHtml(el, true)}
    }`;
  }

  let next = el.nextElementSibling;
  while (next !== null && next.hasAttribute("v-else-if")) {
    expression = processAttr(next, "v-else-if");
    if (expression) {
      code += `else if (${expression}) {
        return ${processHtml(next, true)}
      }`;
    }
    next = next.nextElementSibling;
  }
  if (next !== null && next.hasAttribute("v-else")) {
    next.removeAttribute("v-else");
    code += `else {
      return ${processHtml(next, true)}
    }`;
  }
  return `(() => {
  ${code}
  })()`;
}

function processVFor(el) {
  if (!(el instanceof HTMLElement)) return;
  const expression = processAttr(el, "v-for");
  if (!expression) return;

  // item in arr, (item, index) in arr, {id, name} in arr, ({id, name}, index) in arr
  // key in obj, (key, value) in obj, (key, value, index) in obj
  const splits = expression.split(" in ");
  let args = splits[0].trim();
  if (!args.startsWith("(")) args = `(${args})`;
  let iter = splits[1];

  return `...(
    ${(iter, fn) => {
      const type = typeof iter;
      if (type === "number")
        iter = new Array(iter).fill(undefined).map((v, i) => i);
      else if (type !== "object") return [];
      else if (iter === null) return [];

      if (Array.isArray(iter)) {
        return iter.map((item, index) => fn(item, index));
      } else {
        return Object.entries(iter).map(([key, value], index) =>
          fn(key, value, index)
        );
      }
    }}
  )(${iter},  ${args} => ${processHtml(el, true)})
  `;
}

function processHtml(el, pass) {
  if (!(el instanceof HTMLElement)) return "";
  const expression = processVFor(el);
  if (expression) {
    return expression;
  }
  let code = "";
  code += `createVNode('${el.tagName}',`;
  code += processAttrs(el) + ",\n";
  code += [...el.childNodes]
    .map((child) => processDom(child))
    .filter((item) => item)
    .join(",\n");
  code += `)//createVNode\n`;
  if (pass) el.setAttribute("v-tmp-pass", pass);
  return code;
}

function processDom(el) {
  // if (!(el instanceof HTMLElement)) return;
  // 如果节点是元素节点，则 nodeType 属性将返回 1。
  // 如果节点是属性节点，则 nodeType 属性将返回 2。
  // 如果节点是文本节点，则 nodeType 属性将返回 3。
  // 如果节点是注释节点，则 nodeType 属性将返回 8。
  let code = "";

  switch (el.nodeType) {
    case 1:
      if (processAttr(el, "v-tmp-pass")) return "";
      let expression = processVIF(el);
      if (expression) {
        code = expression;
      } else code = processHtml(el);
      break;
    case 3:
      if (!el.textContent.trim()) return;
      code += `createVNode('TEXT', null, null, null, \`${processText(el)}\`)`;
      break;
    default:
      break;
  }
  return code;
}

function createVNode(name, attrs, events, directives, ...children) {
  return { name, attrs, events, directives, children };
}

/**
 * 比较两个对象的字面量是否一致，未考虑循环引用
 * @param {any} obj1 比较对象1
 * @param {any} obj2 比较对象2
 * @param {boolean} strict 是否严格比较
 * @returns 是否一致
 */
function equal(obj1, obj2, strict = false) {
  const type = typeof obj1;
  if (type !== typeof obj2) {
    return false;
  }
  if (type === "object") {
    if (obj1 === null) return obj2 === null;
    if (obj2 === null) return obj1 === null;
    if (Array.isArray(obj1) !== Array.isArray(obj2)) {
      return false;
    }
    if (strict) {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
      if (keys1.length !== keys2.length) return false;
      for (let key of keys1) {
        if (!equal(obj1[key], obj2[key])) return false;
      }
      return true;
    } else {
      if (Array.isArray(obj1)) {
        if (obj1.length !== obj2.length) return false;
        for (let i = 0; i < obj1.length; i++) {
          if (!equal(obj1[i], obj2[i])) return false;
        }
        return true;
      }
      for (let key of new Set([...Object.keys(obj1), ...Object.keys(obj2)])) {
        if (!equal(obj1[key], obj2[key])) return false;
      }
      return true;
    }
  }
  return Object.is(obj1, obj2);
}

class Vue {
  #getVNodes;
  #oldVNodes = [];
  static #directives = {};

  constructor(el, { data = {}, methods = {} }) {
    if (typeof el === "string") el = document.querySelector(el);
    if (!(el instanceof HTMLElement)) return;
    if (typeof data !== "object" || data === null) return;

    this.#collectDirectives(el.children);

    const code = `[${[...el.childNodes]
      .map(processDom)
      .filter((item) => item)
      .join(",\n")}]`;

    el.innerHTML = "";

    // 数据双向绑定
    const proxy = this.#createProxyRecursively(data);

    // 获取虚拟DOM的方法
    this.#getVNodes = () =>
      new Function(
        ...Object.keys(proxy),
        `
    ${Object.entries(methods)
      .map(
        ([name, fn]) => `function ${fn}
      ${name}  = ${name}.bind(this);
      `
      )
      .join("\n")}
    ${createVNode}
    return ${code}
  `
      )
        .call(this, ...Object.values(proxy), el)
        .filter((item) => item);

    this.#log(code);

    // this上的数据双向绑定
    Object.keys(proxy).forEach((key) => {
      Object.defineProperty(this, key, {
        get() {
          return proxy[key];
        },
        set(value) {
          proxy[key] = value;
        },
      });
    });

    this.$el = el;
    this.$data = proxy;
    this.$methods = methods;
    this.#oldVNodes = [];

    this.#log(this);
    this.render();
  }

  #collectDirectives(nodes) {
    [...nodes].forEach((node) => {
      node.getAttributeNames().forEach((attr) => {
        if (!attr.startsWith("v-")) return;
        const name = attr.slice(2);
        const expression = node.getAttribute(attr);
        const directive = Vue.#directives[name];
        const binding = {
          name,
          expression,
        };
        directive?.bind?.(node, binding);
      });
      this.#collectDirectives(node.children);
    });
  }

  #createProxyRecursively(obj) {
    if (typeof obj !== "object" || obj === null) return obj;
    if (obj instanceof Date) return obj;
    Object.keys(obj).forEach((key) => {
      obj[key] = this.#createProxyRecursively(obj[key]);
    });
    const self = this;
    return new Proxy(obj, {
      set(target, property, value, receiver) {
        target[property] = value;
        self.render();
        return true;
      },
    });
  }

  #setAttrbute(node, attrName, attrValue) {
    if (!(node instanceof HTMLElement)) return;
    switch (attrName) {
      case ":key":
        // TODO :key
        break;
      case ":style":
        processStyle(node, attrValue);
        break;
      case ":class":
        processClass(node, attrValue);
        break;
      default:
        let attr = attrName.startsWith(":") ? attrName.slice(1) : attrName;
        if (attr === "value") {
          /*
  https://stackoverflow.com/questions/29929797/setattribute-doesnt-work-the-way-i-expect-it-to
Sounds like you faced a confusing difference between element property value and value attribute. Those are not the same things.
The thing is that value-attribute serves the purpose of the default value, 
so if the element already has a property value then changing value-attribute will not be reflected in UI.
          */
          node.value = attrValue;
        } else {
          node.setAttribute(attr, attrValue);
        }
        break;
    }
  }

  #createNode(vNode, oldVNode) {
    const { name, children } = vNode;
    let node;
    if (name === "TEXT") node = document.createTextNode(children[0]);
    else {
      node = document.createElement(name);
      this.#triggerDirective(node, vNode, oldVNode, "inserted");
      // 属性
      if (vNode.attrs) {
        Object.keys(vNode.attrs).forEach((name) =>
          this.#setAttrbute(node, name, vNode.attrs[name].value)
        );
      }
      // 事件
      if (vNode.events) {
        Object.keys(vNode.events).forEach((name) =>
          node.addEventListener(name, vNode.events[name].value)
        );
      }
      this.#diff(vNode.children, [], node);
    }
    return node;
  }

  #triggerDirective(node, vNode, oldVNode, ...fnNames) {
    const directives = vNode.directives ?? {};
    Object.keys(directives).forEach((name) => {
      const directive = Vue.#directives[name];
      if (!directive) return;
      const oldValue = oldVNode?.directives?.[name].value;
      const { value, expression } = directives[name];
      const binding = {
        name,
        value,
        oldValue,
        expression,
        arg: "",
        modifiers: "",
      };
      fnNames.forEach((fnName) =>
        directive[fnName]?.(node, binding, vNode, oldVNode)
      );
    });
  }

  #log(...args) {
    if (false) console.log(...args);
  }

  #diff(vNodes, oldVNodes, parent) {
    if (!(parent instanceof HTMLElement)) return;
    const length = Math.max(vNodes.length, oldVNodes.length);
    for (let i = 0; i < length; i++) {
      const vNode = vNodes[i];
      const oldVNode = oldVNodes[i];
      const node = parent.childNodes[i];
      const attrs = vNode?.attrs ?? {};
      const lastAttrs = oldVNode?.attrs ?? {};
      const allAttrKeys = [
        ...new Set([...Object.keys(attrs), ...Object.keys(lastAttrs)]),
      ];
      if (vNode === undefined) {
        this.#log("remove", oldVNode.name);
        node.remove();
        continue;
      }
      if (oldVNode === undefined) {
        this.#log("create", vNode.name);
        let newNode = this.#createNode(vNode, oldVNode);
        parent.appendChild(newNode);
        continue;
      }
      if (vNode.name !== oldVNode.name) {
        this.#log("update", oldVNode.name, "->", vNode.name);
        let newNode = this.#createNode(vNode, oldVNode);
        parent.insertBefore(newNode, node);
        node.remove();
        continue;
      }
      // 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新。
      this.#triggerDirective(node, vNode, oldVNode, "update");
      allAttrKeys.forEach((attr) => {
        if (!(attr in vNode.attrs)) {
          node.removeAttribute(attr);
          return;
        }
        if (equal(vNode.attrs[attr], oldVNode.attrs[attr])) return;
        this.#log(vNode.attrs.id?.value, attr, vNode.attrs[attr].value);
        this.#setAttrbute(node, attr, attrs[attr].value);
      });
      // oldVNode: {name: 'TEXT', children: ['']} 会没有 node（自动过滤掉了）
      if (vNode.name === "TEXT") {
        const textContent = vNode.children[0];
        const oldTextContent = oldVNode.children[0];
        if (!equal(textContent, oldTextContent)) {
          this.#log("update", oldTextContent, "->", textContent);
          parent.textContent = textContent;
        }
      } else {
        this.#diff(vNode.children, oldVNode.children, node);
      }
      // 指令所在组件的 VNode 及其子 VNode 全部更新后调用。
      this.#triggerDirective(node, vNode, oldVNode, "componentUpdated");
    }
  }

  render() {
    const vNodes = this.#getVNodes();
    this.#log({ vNodes, oldVNodes: this.#oldVNodes });
    // 重新渲染时候，不要全部更新，比较更新（尽量最小更新，否则会有一些用户体验问题，例如：input框失去焦点）
    this.#diff(vNodes, this.#oldVNodes, this.$el);
    this.#oldVNodes = vNodes;
  }

  static directive(name, { bind, inserted, update, componentUpdated, unbind }) {
    Vue.#directives[name] = {
      bind,
      inserted,
      update,
      componentUpdated,
      unbind,
    };
  }
}

Vue.directive("model", {
  bind(el, binding, vNode, oldVNode) {
    if (!(el instanceof HTMLElement)) return;
    const { name, value, oldValue, expression, arg, modifiers } = binding;
    el.setAttribute(":value", expression);
    el.setAttribute("v-on:input", `this.${expression} = $event.target.value`);
  },
});
