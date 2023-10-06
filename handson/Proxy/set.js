const p = new Proxy(
  {},
  {
    set(target, property, value, receiver) {
      target[property] = value;
      console.log("property set: " + property + " = " + value);
      // receiver 是 p
      // receiver：最初被调用的对象，通常就是 proxy 对象本身
      // console.log({ target, receiver }, target === receiver, receiver === p);
      return true;
    },
  }
);

p.a = 1;
p.hello = function () {
  console.log("hello");
};
p.hello();
