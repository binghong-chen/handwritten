// https://www.bilibili.com/video/BV1By4y1F743
//大厂都在考的前端面试题：可以重试的请求方法【渡一教育】

/**
 * 发出请求，返回Promise
 * @param {string} url 请求地址
 * @param {number} maxCount 最大重试次数
 */
function request(url, maxCount = 3) {
  return new Promise((resolve, reject) => {
    function lauch() {
      fetch(url)
        .then((res) => {
          console.log("成功");
          resolve(res);
        })
        .catch((reason) => {
          console.log("失败");
          if (maxCount <= 0) {
            reject(reason);
            return;
          }
          lauch();
          maxCount--;
        });
    }
    lauch();
  });
}

request("https://www.google.com")
  .then(async (res) => {
    console.log("成功", res);
    console.log(await res.text());
  })
  .catch((reason) => {
    console.error("失败", reason);
  });
