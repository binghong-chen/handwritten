//https://blog.csdn.net/weixin_37680520/article/details/108686076

function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() - start < delay) {
    continue;
  }
}

function test() {
  console.log("111");
  sleep(2000);
  console.log("222");
}

test();
