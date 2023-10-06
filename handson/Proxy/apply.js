function sum(a, b) {
  return a + b;
}

const p = new Proxy(sum, {
  apply: function (target, thisArg, argumentsList) {
    return argumentsList[0] + argumentsList[1] * 100;
  },
});

console.log(sum(1, 2)); //3
console.log(p(1, 2)); //201
