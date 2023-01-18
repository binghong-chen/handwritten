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
    // 存放成功回调
    this.onResovledCallbacks = [];
    // 存放失败回调
    this.onRejectedCallbacks = [];

    let resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        // 依次将成功回调执行
        this.onResovledCallbacks.forEach((fn) => fn());
      }
    };

    let reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        // 依次将失败回调执行
        this.onRejectedCallbacks.forEach((fn) => fn());
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
    if (this.status === PENDING) {
      // 如果promise的状态是PENDING，需要将onFulfilled和onReject函数存放起来，等待状态确定后，在依次执行
      this.onResovledCallbacks.push(() => onFulfilled(this.value));
      this.onRejectedCallbacks.push(() => onRejected(this.reason));
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

// 执行测试脚本后发现，promise 没有任何返回。
new Promise((resolve, reject) => {
  // 传入一个异步操作
  setTimeout(() => resolve("成功"), 1000);
}).then(
  (data) => console.log("success", data),
  (err) => console.log("failed", er)
);
