const p = new Proxy(
  {},
  {
    get(target, property, recevier) {
      console.log("属性名：", property);
      console.log(recevier); //Proxy {}
      return "陈柄宏";
    },
  }
);

console.log(p.a);
