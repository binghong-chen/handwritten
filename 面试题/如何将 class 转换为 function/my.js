//https://www.bilibili.com/video/BV1Zz4y1G7jm
// 前端经典面试题：如何将 class 转换为 function

function Example(name) {
  this.name = name;
}

Example.prototype.func = function () {
  console.log(this.name);
};

const ex = new Example("abc");
ex.func();

// 1. use strict
// 2. 检查 new Example
// 3. func 不可枚举
// 4. func 不可 new
