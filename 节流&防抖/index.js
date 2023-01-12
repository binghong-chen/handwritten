function throttle(fn, delay) {
  // 函数1
  let timer = null;
  return function () {
    // 函数2
    if (timer) return;
    timer = setTimeout(() => {
      // 函数3
      // this -> global, arguments 是 函数2 的
      // console.log({_this: this,  arguments });
      console.log(+new Date(), "throttle 执行");
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
}

function throttle2(fn, delay) {
  // 函数1
  let timer = null;
  return () => {
    // 函数2
    // 使用 箭头符号 this 和 arguments 不正确
    if (timer) return;
    timer = setTimeout(() => {
      // 函数3
      // this -> global, arguments 是 函数1 的
      // console.log({_this: this,  arguments });
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
}

function throttle3(fn, delay) {
  // 函数1
  let timer = null;
  return () => {
    // 函数2
    // 使用 箭头符号 this 和 arguments 不正确
    if (timer) return;
    timer = setTimeout(function () {
      // 函数3
      // this -> Timeout, arguments为空，其实是函数3的
      // console.log({_this: this,  arguments });
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
}

function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      console.log(+new Date(), "debounce 执行");
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
}

const N = 1e2;
const Delay = 1000;

function testThrottle() {
  const consoleLog = throttle(console.log, Delay);
  const consoleLog2 = throttle2(console.log, Delay);
  const consoleLog3 = throttle3(console.log, Delay);
  console.log(+new Date());
  for (let i = 0; i < N; i++) consoleLog(i); // i=0
  for (let i = 0; i < N; i++) consoleLog2(i); // console.log, 500
  for (let i = 0; i < N; i++) consoleLog3(i); // 空
  let j = 0;
  const timer = setInterval(function () {
    if (j >= 20) {
      clearInterval(timer);
      return;
    }
    consoleLog(j)
    j++;
  }, 200);
}


function testDebounce() {
  const consoleLog = debounce(console.log, Delay);
  for (let i = 0; i < N; i++) consoleLog(i); // i=99
  let j = 0;
  const timer = setInterval(function () {
    if (j >= 20) {
      clearInterval(timer);
      return;
    }
    consoleLog(j)
    j++;
  }, 200);
}

testThrottle();
testDebounce();

`
执行结果
1673502358166
1673502359172 throttle 执行
0
[Function: log] 1000

1673502360187 throttle 执行
4
1673502361191 throttle 执行
9
1673502362195 throttle 执行
14
1673502363198 throttle 执行
19
1673502363199 debounce 执行
19
`

// 节流 每隔多少秒 可以执行一次 可多次执行  执行最开始那个 实例：搜索框实时请求
// 防抖 都少秒之内的合成一次执行 只执行一次 执行最后面那个 实例：resize 窗口，最后算数
