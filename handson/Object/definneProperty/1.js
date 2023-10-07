const obj = new Object();
Object.defineProperty(obj, "a", {
  value: 1,
  configurable: true, //可配置，删除
  enumerable: true, //可枚举
  writable: true, //可修改
});
console.log(obj); //{a:1}
console.log(obj.a); //1

Object.defineProperty(obj, "a", {
  value: "a",
  configurable: true, //可配置，删除
  enumerable: true, //可枚举
  writable: true, //可修改
});
console.log(obj); //{a:'a'}
console.log(obj.a); //a

Object.defineProperty(obj, "b", {
  value: 2,
  configurable: false, //可配置，删除
  enumerable: true, //可枚举
  writable: true, //可修改
});
console.log(obj); //{a:'a',b:2}
console.log(obj.b); //2

// 会报错，应为已经设置为 不可配置
//TypeError: Cannot redefine property: b
// Object.defineProperty(obj, "b", {
//   value: 2,
//   configurable: true, //可配置
//   enumerable: true, //可枚举
//   writable: true, //可修改
// });

delete obj.b; // 无效
console.log(obj); //{a:'a',b:2}
console.log(obj.b); //2

Object.defineProperty(obj, "c", {
  value: 3,
  configurable: true, //可配置，删除
  enumerable: false, //可枚举
  writable: true, //可修改
});
console.log(obj); //{a:'a',b:2}
console.log(obj.c); //3

Object.defineProperty(obj, "d", {
  value: 4,
  configurable: true, //可配置，删除
  enumerable: true, //可枚举
  writable: false, //可修改
});
console.log(obj); //{a:'a',b:2,d:4}
console.log(obj.d); //4

obj.d = 5;
console.log(obj); //{a:'a',b:2,d:4}
console.log(obj.d); //4

delete obj.d; // 可删除
console.log(obj); //{a:'a',b:2}
console.log(obj.d); //undefined

console.log(obj.propertyIsEnumerable("a")); //true
console.log(obj.propertyIsEnumerable("b")); //true
console.log(obj.propertyIsEnumerable("c")); //false
console.log(obj.propertyIsEnumerable("d")); //false
