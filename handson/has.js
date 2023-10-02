Object.prototype.e = 4;

const data = { a: 1, c: undefined, d: null };

function has1(data, key) {
  return data[key] !== undefined;
}

function has2(data, key) {
  return Object.keys(data).includes(key);
}

function has3(data, key) {
  return Object.getOwnPropertyNames(data).includes(key);
}

function has4(data, key) {
  return key in data;
}

console.log(Object.prototype.hasOwnProperty("a"));
console.log(Object.getPrototypeOf(data).hasOwnProperty("a"));
console.log(Object.getPrototypeOf(data).hasOwnProperty("e"));
console.log("-------------");

const keys = "abcde".split("");

function test(has) {
  keys.forEach((key) => {
    console.log(has.name, data, key, has(data, key));
  });
  console.log("-------------");
}

test(has1);
test(has2);
test(has3);
test(has4);
