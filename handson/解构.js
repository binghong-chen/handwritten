// 解构默认值
const data = {
  a: 1,
  b: 2,
  c: 3,
  e: null,
  f: undefined,
  g: 0,
  h: false,
};

const value = "value";
const { a = 10, b, c = value, d = 4, e = 5, f = 6, g = 7, h = 8 } = data;

console.log({ a, b, c, d, e, f, g, h });
// { a: 1, b: 2, c: 3, d: 4, e: null, f: 6, g: 0, h: false }
