// https://juejin.cn/post/6850037281206566919

// 三个状态：PENDING、FULFILLED、REJECTED
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;

    let resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
      }
    };

    let reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    }
    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
  }
}
new Promise((resolve, reject) => {
  resolve("成功");
}).then(
  (data) => console.log("success", data),
  (err) => console.log("failed", err)
);

new Promise((resolve, reject) => {
  reject("失败");
}).then(
  (data) => console.log("success", data),
  (err) => console.log("failed", err)
);

// 执行测试脚本后发现，promise 没有任何返回。
new Promise((resolve, reject) => {
  // 传入一个异步操作
  setTimeout(() => resolve("成功"));
}).then(
  (data) => console.log("success", data),
  (err) => console.log("failed", er)
);
