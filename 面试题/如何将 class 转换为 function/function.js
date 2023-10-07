"use strict";

function Example(name) {
  // 严格模式下 直接调用 Example 时 this 是 undefined
  // 否者是 globalThis
  if (!(this instanceof Example)) {
    throw TypeError(
      `Class constructor ${Example.name} cannot be invoked without 'new'`
    );
  }
  this.name = name;
}

// Example.prototype.func = function () {
//   console.log(this.name);
// };

Object.defineProperty(Example.prototype, "func", {
  value: function () {
    if (!(this instanceof Example)) {
      throw TypeError(`func is not a constructor`);
    }
    console.log(this.name);
  },
  enumerable: false,
});

const ex = new Example("abc");
ex.func();

// 1. use strict ???
// 2. 检查 new Example
Example("abc");
// 3. func 不可枚举
for (let key in ex) {
  console.log(key);
}
// 4. func 不可 new
new ex.func();
