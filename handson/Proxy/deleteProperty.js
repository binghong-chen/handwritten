const p = new Proxy(
  {},
  {
    deleteProperty(target, property) {
      console.log("将要删除属性：", property);
    },
  }
);

delete p.a;
