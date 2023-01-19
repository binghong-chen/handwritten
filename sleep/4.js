// https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/63
// 第 42 题：实现一个 sleep 函数，比如 sleep(1000) 意味着等待1000毫秒，可从 Promise、Generator、Async/Await 等角度实现 #63

// 定时器
function sleep(time) {
    var now = +Date.now()
    while(+Date.now() - now <=time);
    return
}
console.time(1)
sleep(1000)
console.log(123)
console.timeEnd(1)