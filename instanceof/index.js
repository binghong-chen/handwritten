let Person = function () {};
let Programmer = function () {};
Programmer.prototype = new Person();
let nicole = new Programmer();

function Foo() {}

function isObject(value) {
  return value !== null && typeof value === "object";
}

function isFunction(value) {
  return typeof value === "function";
}

function myInstanceOf(leftValue, rightValue) {
  // 右边不是 类型
  const rightIsObject = isObject(rightValue);
  const rightIsCallable = isFunction(rightValue);

  if (!rightIsCallable) {
    if (!rightIsObject)
      throw new TypeError("Right-hand side of 'instanceof' is not an object");
    throw new TypeError("Right-hand side of 'instanceof' is not callable");
  }

  if (rightValue === Function.prototype) {
    throw new TypeError(
      "Function has non-object prototype 'undefined' in instanceof check"
    );
  }

  // 左边不是类型 1 instanceof Number false
  if (!isObject(leftValue) && !isFunction(leftValue)) return false;
  let rightProto = rightValue.prototype;
  leftValue = leftValue.__proto__;
  while (true) {
    if (leftValue === null) return false;
    if (leftValue === rightProto) return true;
    leftValue = leftValue.__proto__;
  }
}

function getResult(func, obj, type) {
  try {
    return func(obj, type);
  } catch (e) {
    return e + "";
  }
}

function test(obj, type) {
  const expect = getResult((obj, type) => obj instanceof type, obj, type);
  const actual = getResult(myInstanceOf, obj, type);
  //   if (typeof expect === "string") {
  //     console.log({ obj, type, expect, actual });
  //   }
  if (actual !== expect) {
    console.error({ obj, type, expect, actual });
  }
}

function test1() {
  console.log(nicole.__proto__ === Programmer.prototype); //true

  // console.log(myInstanceOf(1, 1)); //Right-hand side of 'instanceof' is not an object

  const fun = new Function();

  console.log(typeof fun); // function
  console.log(fun.prototype); // 自己的原型（类比 Object 的原型）
  console.log(fun.constructor === Function); //true （所有函数的constructor都是Function）
  console.log(fun.__proto__ === Function.prototype); //true（所有函数的__proto__都指向 Function的原型）

  const man = {
    hello() {},
  };

  class Dog {}

  // 所有函数/类的__proto__都一样
  console.log(Object.__proto__ === Function.__proto__);
  console.log(Object.__proto__ === Person.__proto__);
  console.log(Object.__proto__ === man.hello.__proto__);
  console.log(Object.__proto__ === Dog.__proto__);
  console.log(Object.__proto__ === fun.__proto__);
  console.log(Object.__proto__ === new Function().__proto__);
  console.log(Object.__proto__ === Function().__proto__);
}

// test1();

test(nicole, Person);
test(nicole, Programmer);
test(Object, Object);
test(Function, Function);
test(Function, Object);
test(Foo, Foo);
test(Foo, Function);
test(Foo, Object);
test(1, Object);
test(1, Number);
test(1, String);
test(1, BigInt);
test(NaN, BigInt);
test(NaN, Number);
test(null, Number);
test(null, Object);
test(null, null);
test(null, Function);
test(1, null);
test(1, undefined);
test(undefined, undefined);
test(undefined, Object);
test(true, Object);
test(false, Object);
test(new Boolean(false), Object);
test(new Boolean(true), Object);
test(Object.prototype, Object);
test(Object.prototype.constructor, Object);
test(Object.prototype.constructor, Function);
test(Object.prototype.constructor, {});
test(Object, {});
test(Object, Object.constructor);
test(Object.constructor, Function);
test(Object.constructor, Function.__proto__);
test(Object.constructor, Function.prototype);
test(Object.constructor, Function.prototype.__proto__);
test({}, Object.__proto__);
test({}, new Function());
test(Symbol, Function);
test(Symbol, Symbol);
test(Function, Symbol);
test(Symbol, Object);
test(Object, Symbol);
