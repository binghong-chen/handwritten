console.log(Object.constructor === Function);
const obj = new Object();
console.log(obj.__proto__ === Object.prototype);
console.log(obj.constructor === Object);

const obj2 = { a: 1 };
console.log(obj2.propertyIsEnumerable("a")); //false
console.log(obj2.propertyIsEnumerable("b")); //false
console.log(obj2.propertyIsEnumerable("__proto__")); //false

const proto = { name: "cbh" };
const obj3 = { age: 31 };
Object.setPrototypeOf(obj3, proto);
console.log(obj3.propertyIsEnumerable("age")); //true
console.log(obj3.propertyIsEnumerable("name")); //false
