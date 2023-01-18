// https://juejin.cn/post/6850037281206566919

// 在 Promise 出现以前，在我们处理多个异步请求嵌套时，代码往往是这样的。。。

let fs  = require('fs')

fs.readFile('./name.txt', 'utf8', function(err, data) {
    fs.readFile(data, 'utf8', function(err, data) {
        fs.readFile(data, 'utf8', function(err, data) {
            console.log(data)
        })
    })
})

function read(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) reject(err)
            resolve(data)
        })
    })
}

read('./name.txt').then(read).read(read).then(console.log, console.error)