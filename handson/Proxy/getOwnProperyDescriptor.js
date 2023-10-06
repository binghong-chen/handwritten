const p = new Proxy(
  {},
  {
    getOwnPropertyDescriptor(target, prop) {
      console.log("属性名称：", prop);
      return { configurable: true, enumerable: true, value: "陈柄宏" };
    },
  }
);

console.log(p.name); //undefined
console.log(Object.getOwnPropertyDescriptor(p, "name").value);
