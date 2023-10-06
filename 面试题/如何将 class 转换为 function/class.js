//https://www.bilibili.com/video/BV1Zz4y1G7jm
// 前端经典面试题：如何将 class 转换为 function
class Example {
  constructor(name) {
    this.name = name;
  }
  func() {
    console.log(this.name);
  }
}

// strict mode 编译错误
// Example("abc"); //TypeError: Class constructor Example cannot be invoked without 'new'
const ex = new Example("abc");

// func 不可枚举
for (let key in ex) {
  console.log(key);
}

new ex.func(); //TypeError: ex.func is not a constructor
