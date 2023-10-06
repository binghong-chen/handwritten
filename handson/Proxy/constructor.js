const p = new Proxy(function () {}, {
  construct(target, argumentsList, newTarget) {
    return { value: "我是" + argumentsList[0] };
  },
});

console.log(new p("陈柄宏"));

const p1 = new Proxy(class Man {}, {
  construct(target, argumentsList, newTarget) {
    console.log({ target, newTarget });
    return { value: "我是" + argumentsList[0] };
  },
});

console.log(new p1("陈柄宏"));
