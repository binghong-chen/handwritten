console.log(Object.constructor === Function);
const obj = new Object();
console.log(obj.__proto__ === Object.prototype);
console.log(obj.constructor === Object);
const obj2 = { a: 1 };
console.log(obj2.propertyIsEnumerable("a"));
console.log(obj2.propertyIsEnumerable("b"));
console.log(obj2.propertyIsEnumerable("__proto__")); //false
