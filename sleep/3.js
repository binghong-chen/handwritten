// https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/63
// 第 42 题：实现一个 sleep 函数，比如 sleep(1000) 意味着等待1000毫秒，可从 Promise、Generator、Async/Await 等角度实现 #63

function sleep(time) {
    function *gen() {
        yield new Promise(resolve => setTimeout(resolve, time))
    }
    return gen().next().value
}
sleep(1000).then(()=>console.log('sleep end'))