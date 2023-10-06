const p = new Proxy(
  {},
  {
    defineProperty(target, property, descriptor) {
      // descriptor.enumerable = false;
      console.log(property, descriptor);
      return true;
    },
  }
);

const desc = { configurable: true, enumerable: true, value: 10 };
Object.defineProperty(p, "a", desc);

for (let key in p) console.log(key); // 即使 enumerable 是 true，也不能遍历
