function processText(el) {
  return el.textContent.replace(
    /\{\{(.+?)\}\}/g,
    (expressWithBrace, express) => `\${${express}}` ?? expressWithBrace
  );
}

function processAttr(el, attrName) {
  if (!(el instanceof HTMLElement)) return;
  if (!el.hasAttribute(attrName)) return;
  const express = el.getAttribute(attrName);
  el.removeAttribute(attrName);
  return express;
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
  const codeList = [];
  el.getAttributeNames().forEach((attrName) => {
    if (attrName.startsWith("@")) {
      const express = processAttr(el, attrName);
      codeList.push(`'${attrName}': $event => {${express}}`);
      return;
    }
    if (attrName.startsWith(":") || attrName.startsWith("v-")) {
      const express = processAttr(el, attrName);
      codeList.push(`'${attrName}': ${express ? express : undefined}`);
      return;
    }
    codeList.push(`'${attrName}': '${el.getAttribute(attrName)}'`);
  });
  return `{\n${codeList.join(",\n")}\n}`;
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
  let express = processAttr(el, "v-if");
  if (express) {
    code += `if (${express}) {
      return ${processHtml(el, true)}
    }`;
  }

  let next = el.nextElementSibling;
  while (next !== null && next.hasAttribute("v-else-if")) {
    express = processAttr(next, "v-else-if");
    if (express) {
      code += `else if (${express}) {
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
  const express = processAttr(el, "v-for");
  if (!express) return;

  // item in arr, (item, index) in arr, {id, name} in arr, ({id, name}, index) in arr
  // key in obj, (key, value) in obj, (key, value, index) in obj
  const splits = express.split(" in ");
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
  const express = processVFor(el);
  if (express) {
    return express;
  }
  let code = "";
  code += `createVDom('${el.tagName}',`;
  code += processAttrs(el) + ",\n";
  code += [...el.childNodes]
    .map((child) => processDom(child))
    .filter((item) => item)
    .join(",\n");
  code += `)//createVDom\n`;
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
      let express = processVIF(el);
      if (express) {
        code = express;
      } else code = processHtml(el);
      break;
    case 3:
      if (!el.textContent.trim()) return;
      code += `createVDom('TEXT', null, \`${processText(el)}\`)`;
      break;
    default:
      break;
  }
  return code;
}

function createVDom(name, attrs, ...children) {
  return { name, attrs, children };
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
      // console.log({ keys1, keys2 });
      if (keys1.length !== keys2.length) return false;
      for (let key of keys1) {
        if (!equal(obj1[key], obj2[key])) return false;
      }
      return true;
    } else {
      if (Array.isArray(obj1)) {
        if (obj1.length !== obj2.length) return false;
        // [empty] 和 [undefined]
        // Object.keys()不能取到 empty
        for (let i = 0; i < obj1.length; i++) {
          if (!equal(obj1[i], obj2[i])) return false;
        }
        return true;
      }
      // {a: undefined} 和 {}
      for (let key of new Set([...Object.keys(obj1), ...Object.keys(obj2)])) {
        if (!equal(obj1[key], obj2[key])) return false;
      }
      return true;
    }
  }
  return Object.is(obj1, obj2);
}

class Vue {
  #getVDomList;
  #lastVDomList = [];

  constructor(el, { data = {}, methods = {} }) {
    if (typeof el === "string") el = document.querySelector(el);
    if (!(el instanceof HTMLElement)) return;
    if (typeof data !== "object" || data === null) return;

    const code = `[${[...el.childNodes]
      .map(processDom)
      .filter((item) => item)
      .join(",\n")}]`;

    el.innerHTML = "";

    // 数据双向绑定
    const proxy = this.createProxyRecursively(data);

    // 获取虚拟DOM的方法
    this.#getVDomList = () =>
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
    ${createVDom}
    return ${code}
  `
      )
        .call(this, ...Object.values(proxy), el)
        .filter((item) => item);

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
    this.#lastVDomList = [];

    console.log(this);
    this.render();
  }

  createProxyRecursively(obj) {
    if (typeof obj !== "object" || obj === null) return obj;
    if (obj instanceof Date) return obj;
    Object.keys(obj).forEach((key) => {
      obj[key] = this.createProxyRecursively(obj[key]);
    });
    const self = this;
    return new Proxy(obj, {
      set(target, property, value, receiver) {
        target[property] = value;
        console.log("this", this);
        self.render();
        return true;
      },
    });
  }

  #setAttrbute(node, attrName, attrValue) {
    if (!(node instanceof HTMLElement)) return;
    // TODO 注册的指令
    if (attrName.startsWith("v-")) {
      if ("v-else,v-else-if".split(",").includes(attrName)) {
        console.error(`${attrName} should after v-if`);
        return;
      }
      console.log({ attrName });
      return;
    }
    // 事件
    if (attrName.startsWith("@")) {
      node.addEventListener(attrName.slice(1), attrValue);
      return;
    }
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
        let _attrName = attrName.startsWith(":") ? attrName.slice(1) : attrName;
        node.setAttribute(_attrName, attrValue);
        break;
    }
  }

  #createNode(vDom) {
    const { name, attrs, children } = vDom;
    let node;
    if (name === "TEXT") node = document.createTextNode(children[0]);
    else {
      node = document.createElement(name);
      for (let attrName in attrs) {
        this.#setAttrbute(node, attrName, attrs[attrName]);
      }
    }
    console.log("createNode", node);
    return node;
  }

  diff(vDomList, lastVDomList, parent) {
    if (parent.nodeType === 3) {
      console.log("update", lastVDomList[0], "->", vDomList[0]);
      parent.textContent = vDomList[0];
      return;
    }
    if (!(parent instanceof HTMLElement)) return;
    const length = Math.max(vDomList.length, lastVDomList.length);
    for (let i = 0; i < length; i++) {
      const vDom = vDomList[i];
      const lastVDom = lastVDomList[i];
      const node = parent.childNodes[i];
      if (vDom === undefined) {
        console.log("remove", lastVDom.name);
        node.remove();
        continue;
      }
      if (lastVDom === undefined) {
        console.log("create", vDom.name);
        let newNode = this.#createNode(vDom);
        this.diff(vDom.children, [], newNode);
        parent.appendChild(newNode);
        continue;
      }
      if (vDom.name !== lastVDom.name) {
        console.log("update", lastVDom.name, "->", vDom.name);
        let newNode = this.#createNode(vDom);
        this.diff(vDom.children, [], node);
        parent.insertBefore(newNode, node);
        node.remove();
        continue;
      }
      [
        ...new Set(
          ...Object.keys(vDom.attrs ?? {}),
          ...Object.keys(lastVDom.attrs ?? {})
        ),
      ].forEach((attr) => {
        if (!(attr in vDom.attrs)) {
          node.removeAttribute(attr);
          return;
        }
        if (equal(vDom.attrs[attr], lastVDom.attrs[attr])) return;
        this.#setAttrbute(node, attr, vDom.attrs[attr]);
      });
      this.diff(vDom.children, lastVDom.children, node);
    }
  }

  render() {
    const vDomList = this.#getVDomList();
    console.log({ vDomList, lastVDomList: this.#lastVDomList });
    // 重新渲染时候，不要全部更新，比较更新（尽量最小更新，否则会有一些用户体验问题，例如：input框失去焦点）
    this.diff(vDomList, this.#lastVDomList, this.$el);
    this.#lastVDomList = vDomList;
  }
}
