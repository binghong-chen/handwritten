function deepClone(data) {
  if (data instanceof Date) return new Date(data);
  if (data instanceof RegExp) return new RegExp(data);
  if (typeof data !== "object") return data;
  if (data === null) return null;
  if (Array.isArray(data)) return data.map(deepClone);
  let res = {};
  for (let key in data) {
    res[key] = deepClone(data[key]);
  }
  return res;
}

function test(data) {
  const res = deepClone(data);
  const type = typeof data;
  if (
    (type === "object" && JSON.stringify(res) !== JSON.stringify(data)) ||
    (type !== "object" && res !== data)
  ) {
    console.log({ data, res });
  }
}
test();
test(null);
test("");
test(0);
test(1);
test(false);
test(true);
test(new Date());
test(/abc/g);
test([]);
test({});
test({ a: 1 });
test({ a: [] });
test({ a: [1, 2, 3] });
test({ a: [1, null, 3] });
test({ a: [1, { b: true, c: { aaa: 1 } }, 3] });
test(console.log);

const data = [1, { a: 2 }, ["a", "b"]];
const res = deepClone(data);
console.log(res);
console.log(res === data);
data.forEach((v, i) => console.log(v === res[i]));
