// https://juejin.cn/post/6850037281206566919

// Promise/A+
// https://promisesaplus.com/
const p1 = new Promise((resolve, reject) => {
    console.log('create a promise')
    resolve('成功了')
})

console.log('after new promise')

const p2 = p1.then(data => {
    console.log(data)
    throw new Error('失败了')
})

const p3 = p2.then(data => {
    console.log('success', data)
}, err => {
    console.log('fail', err)
})