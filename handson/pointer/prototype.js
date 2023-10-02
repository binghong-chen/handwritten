function User() {}

// 默认就是
// User.prototype = new Object();

const user = new User();

console.log(User.prototype.constructor === User); //true

console.log(user.constructor === User); //true
console.log(user.__proto__); // {}
console.log(user.__proto__.__proto__); // [Object: null prototype] {}
console.log(User.prototype); // {}

console.log(Object.getPrototypeOf(user)); // {}
console.log(Object.getPrototypeOf(User)); // {}

console.log(Object.prototype.constructor === Object); //true

console.log(Object.prototype.isPrototypeOf(user));
console.log(Object.prototype.isPrototypeOf(User));
console.log(User.prototype.isPrototypeOf(user));
