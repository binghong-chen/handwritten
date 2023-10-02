const rootPrototype = Object.prototype;
// console.log(typeof rootPrototype); //object
// console.log(rootPrototype.isPrototypeOf({}));
// console.log(rootPrototype.isPrototypeOf(Object));
// console.log(rootPrototype.isPrototypeOf(rootPrototype)); //false
// console.log(rootPrototype.isPrototypeOf(Function));
// console.log(rootPrototype.isPrototypeOf(String));

function isObject(value) {
  return value !== null && typeof value === "object";
}

function isFunction(value) {
  return typeof value === "function";
}

rootPrototype.isPrototypeOf2 = function (v) {
  if (!isObject(v) && !isFunction(v)) return false;
  let _v = v.__proto__;
  while (_v) {
    if (_v === this) return true;
    _v = _v.__proto__;
  }
  return false;
};

function getResult(func, v) {
  try {
    return func(v);
  } catch (e) {
    return e + "";
  }
}

function test(v) {
  const expect = getResult((v) => rootPrototype.isPrototypeOf(v), v);
  const actual = getResult((v) => rootPrototype.isPrototypeOf2(v), v);
  //   if (typeof expect === "string") {
  //     console.log({ obj, type, expect, actual });
  //   }
  if (actual !== expect) {
    console.error({ v, expect, actual });
  }
}

test({});
test(Object);
test(rootPrototype);
test(Function);
test(String);
test(Function.prototype);
test(Object.__proto__);
test();
test(null);
test(1);
test(new Number(1));
test(Number(1));
test(Function());
test(new Function());
test(new Boolean(false));
test(Boolean(false));
test(Symbol("aa"));
test(Symbol);
test(console);
test(console.log);
