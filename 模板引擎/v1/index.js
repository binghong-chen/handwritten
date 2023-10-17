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
  code += `createElement('${el.tagName}',`;
  code += processAttrs(el) + ",\n";
  code += [...el.childNodes]
    .map((child) => processDom(child))
    .filter((item) => item)
    .join(",\n");
  code += `)//createElement\n`;
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
      code += `createElement('TEXT', null, \`${processText(el)}\`)`;
      break;
    default:
      break;
  }
  return code;
}

function createElement(name, attrs, ...children) {
  // console.log(arguments, { name, children, attrs });
  return { name, attrs, children };
}

function render(el, { data, methods = {} }) {
  if (typeof el === "string") el = document.querySelector(el);
  if (!(el instanceof HTMLElement)) return;
  if (typeof data !== "object" || data === null) return;

  const code = `[${[...el.childNodes]
    .map(processDom)
    .filter((item) => item)
    .join(",\n")}]`;

  el.innerHTML = "";

  const topFunc = new Function(
    ...Object.keys(data),
    `
    ${Object.entries(methods)
      .map(
        ([name, fn]) => `function ${fn}
      ${name}  = ${name}.bind(this);
      `
      )
      .join("\n")}
    ${createElement}
    return ${code}
  `
  );

  console.log(topFunc.toString());
  const result = topFunc
    .call(
      { ...data, $data: data, $methods: methods },
      ...Object.values(data),
      el
    )
    .filter((item) => item);
  console.log({ data, result });

  function commitNode(nodeOption) {
    const { name, attrs, children } = nodeOption;
    let node;
    if (name === "TEXT") node = document.createTextNode(children[0]);
    else {
      node = document.createElement(name);
      if ("v-show" in attrs && !attrs["v-show"]) {
        attrs[":style"] = attrs[":style"] ?? {};
        attrs["display"] = "none";
      }
      for (let attr in attrs) {
        const value = attrs[attr];
        switch (attr) {
          case ":key":
            // TODO :key
            break;
          case ":style":
            processStyle(node, value);
            break;
          case ":class":
            processClass(node, value);
            break;
          // TODO 注册的指令
          default:
            node.setAttribute(attr, value);
            break;
        }
      }
      commit(children.filter((item) => item)).forEach((child) =>
        node.appendChild(child)
      );
    }
    return node;
  }
  function commit(nodeOptionList) {
    let nodes = [];
    for (let i = 0; i < nodeOptionList.length; i++) {
      let nodeOption = nodeOptionList[i];
      nodes.push(commitNode(nodeOption));
    }
    return nodes;
  }
  commit(result).forEach((child) => el.appendChild(child));
}
