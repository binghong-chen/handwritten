const p = new Proxy(
  {},
  {
    setPrototypeOf(target, prototype) {
      console.log("触发拦截");
      return true;
    },
  }
);

Object.setPrototypeOf(p, { name: "cbh" });
p.__proto__ = { name: "cbh" };
