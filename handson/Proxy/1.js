/*
handler.apply()
handler.construct()
handler.defineProperty()
handler.deleteProperty()
handler.get()
handler.getOwnPropertyDescriptor()
handler.getPrototypeOf()
handler.has()
handler.isExtensible()
handler.ownKeys()
handler.preventExtensions()
handler.set()
*/

const obj = {
  name: "cbh",
  age: 31,
};

const p = new Proxy(obj, {});

console.log(obj);
console.log(p); //与ob一致
