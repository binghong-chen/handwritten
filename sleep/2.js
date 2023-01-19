// https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/63
// 第 42 题：实现一个 sleep 函数，比如 sleep(1000) 意味着等待1000毫秒，可从 Promise、Generator、Async/Await 等角度实现 #63

// 4种方法

// Promise
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
sleep(1000).then(() => console.log('Promise'));

// Generator
function * sleepGenerator(time) {
    yield new Promise(resolve => setTimeout(resolve, time))
}
sleepGenerator(1000).next().value.then(()=> console.log('Generator'))

// async
async function output() {
    let out = await sleep(1000)
    console.log('async')
    return out
}
output()

// ES5
function sleepES5(callback, time) {
    if (typeof callback === 'function') setTimeout(callback, time)
}
function output2() {
    console.log('ES5')
}
sleepES5(output2, 1000)