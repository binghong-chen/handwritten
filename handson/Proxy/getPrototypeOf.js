const obj = { msg: "拦截获取对象原型操作" };

const p = new Proxy(
  {},
  {
    getPrototypeOf(target) {
      console.log("getPrototypeOf", target);
      // getPrototypeOf 方法必须返回一个对象或者 null。
      return obj;
    },
  }
);

/*
以下操作会触发代理对象的该拦截方法：

Object.getPrototypeOf()
Reflect.getPrototypeOf()
__proto__
Object.prototype.isPrototypeOf()
*/

console.log(p.__proto__);
console.log(Object.getPrototypeOf(p));
console.log(Reflect.getPrototypeOf(p));
console.log(obj.isPrototypeOf(p)); //true
console.log(p instanceof Object);
