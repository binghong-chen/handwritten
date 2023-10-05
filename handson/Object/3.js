const obj = new Object();

Object.defineProperty(obj, "a", {
  get() {
    return "123";
  },
});
console.log(obj); //{}
console.log(obj.a); //123
console.log(obj.hasOwnProperty("a")); //true

obj.a = 456; //无法修改
console.log(obj); //{}
console.log(obj.a); //123
console.log(obj.hasOwnProperty("a")); //true

delete obj.a; //无法删除
console.log(obj); //{}
console.log(obj.a); //123
console.log(obj.hasOwnProperty("a")); //true

// TypeError: Cannot redefine property: a
// Object.defineProperty(obj, "a", {
//   value: 456,
// });

// TypeError: Cannot redefine property: a
// Object.defineProperty(obj, "a", {
//   set(v) {
//     console.log("set", v);
//   },
// });

(function () {
  var value;

  Object.defineProperty(obj, "b", {
    get() {
      return value;
    },
    set(v) {
      value = v;
    },
  });

  console.log(obj); //{}
  console.log(obj.b); //undefined
  obj.b = 456;
  console.log(obj); //{}
  console.log(obj.b); //456
})();
