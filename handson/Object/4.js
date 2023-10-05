// https://www.bilibili.com/video/BV1eh4y1A7GF/
// 从一道面试题看闭包“漏洞”，闭包真的“闭”吗【渡一教育】
// 原型链漏洞
var data = (function () {
  var obj = { a: 1, b: 2 };

  return {
    get: function (k) {
      return obj[k];
      // return obj[k](); //valueOf
    },
  };
})();

// 如何在不修改上面代码的情况下，修改 obj 对象

// console.log(data.get("valueOf"));//return obj[k]();
console.log(data.get("__proto__")); // Object.prototype
// console.log(data.get("valueOf")());//TypeError: Cannot convert undefined or null to object

const valueOf = Object.prototype.valueOf;
// valueOf(); //TypeError: Cannot convert undefined or null to object

Object.defineProperty(Object.prototype, "abc", {
  get() {
    // this 指向 当前 obj （是从哪个对象查找到 Object.prototype ? 是 obj
    // data.get('abc') -> obj.abc -> obj.__proto__.abc -> Object.prototype.abc -> this -> obj
    return this;
  },
});

console.log(data.get("a")); //1
console.log(data.get("abc")); // { a: 1, b: 2 }
data.get("abc").a = 123;
console.log(data.get("a")); //123

// 解决 1
data = (function () {
  var obj = { a: 1, b: 2 };

  return {
    get: function (k) {
      if (!obj.hasOwnProperty(k)) return;
      return obj[k];
    },
  };
})();

console.log(data.get("a")); //1
console.log(data.get("abc")); //undefined

// 解决 2
data = (function () {
  var obj = { a: 1, b: 2, __proto__: null };

  return {
    get: function (k) {
      return obj[k];
    },
  };
})();

console.log(data.get("a")); //1
console.log(data.get("abc")); //undefined

// 解决 3
data = (function () {
  var obj = { a: 1, b: 2 };
  Object.setPrototypeOf(obj, null);

  return {
    get: function (k) {
      return obj[k];
    },
  };
})();

console.log(data.get("a")); //1
console.log(data.get("abc")); //undefined
