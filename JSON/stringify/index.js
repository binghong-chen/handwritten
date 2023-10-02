const JSON1 = {
  stringify(value) {
    // 解决循环引用
    const map = new Map();
    function inner(obj, keys = []) {
      if (obj === null) return null + "";
      if (obj instanceof Date) {
        obj = obj.toISOString();
      }
      const type = typeof obj;
      switch (type) {
        case "bigint":
          throw new TypeError("Do not know how to serialize a BigInt");
        case "number":
        case "boolean":
          return obj.toString();
        case "string":
          return `"${obj}"`;
        case "object":
          if (map.has(obj)) {
            // 对象第一次出现的位置
            const oldKeys = map.get(obj);
            // 循环链
            const circleKeys = keys.slice(oldKeys.length);
            // console.log({ oldKeys, keys, circleKeys });
            const messages = [];
            messages.push("Converting circular structure to JSON");
            messages.push(
              `    --> starting at object with constructor '${obj.constructor.name}'`
            );
            messages.push(
              ...circleKeys.map(({ key, constructor }, index) => {
                return index === circleKeys.length - 1
                  ? `    --- ${key} closes the circle`
                  : `    |     ${key} -> object with constructor '${constructor}'`;
              })
            );
            throw new TypeError(messages.join("\n"));
          }
          map.set(obj, keys);
          const arr = [];
          if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
              let value = obj[i];
              if (value === undefined) {
                arr.push(null + "");
              } else {
                arr.push(
                  inner(value, [
                    ...keys,
                    { key: `index ${i}`, constructor: value?.constructor.name },
                  ])
                );
              }
            }
            return `[${arr}]`;
          }
          // forEach 不遍历 empty
          // obj.forEach((value, index) => {
          //   console.log({ obj, value });
          // });
          // 只保留自己的，不要原型链上的
          for (let key of Object.keys(obj)) {
            // for (let key in obj) {
            const value = obj[key];
            if (value === undefined) continue;
            const result = inner(obj[key], [
              ...keys,
              {
                key: `property '${key}'`,
                constructor: obj[key]?.constructor.name,
              },
            ]);
            if (result === undefined) continue;
            arr.push(`"${key}":${result}`);
          }
          return `{${arr}}`;
        default:
          return undefined;
      }
    }
    return inner(value);
  },
};

function getResult(func, obj) {
  try {
    return func(obj);
  } catch (e) {
    return e + "";
  }
}

function test(obj) {
  const expect = getResult(JSON.stringify, obj);
  const actual = getResult(JSON1.stringify, obj);
  //   if (typeof expect === "string") {
  //     console.log({ obj, expect, actual });
  //   }
  if (actual !== expect) {
    console.error({ obj, expect, actual });
  }
}

test();
test(null);
test(0);
test(1);
test(1e3);
test(-1323.12313113);
test(Math.PI);
test(true);
test(false);
test("");
test("a");
test("0");
test("1");
test(BigInt("123131313199999"));
test({});
test({ a: 1 });
test({ a: undefined });
test({ a: null });
test({ a: {} });
test({ a: { hello() {} } });
test([]);
test([undefined]);
test([[]]);
test([null]);
test([1]);
test([1, "hello", {}, [1, 2, 3]]);
test(function () {});
test(Object);
test(Object.prototype);
test(Symbol);
test(Symbol());
test(new Date());
test(/1/gi);
test(new Object());
test(new Array(4));
test(new Array(1, 2));
test(new Array(1, 2, 4));

const arr = new Array(3);
arr[1] = 2;
test(arr);

arr[2] = arr;
test(arr);

const obj = {};
obj["obj"] = obj;
obj["self"] = obj;

test(obj);

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

class User extends Person {
  constructor(name, age, hobbit) {
    super(name, age);
    this.hobbit = hobbit;
  }
}

const person = new Person("Jack", 27);
const user = new User("Tim", 36, "Sing");

function Jack() {}
Jack.prototype = person;
const jack = new Jack();

// console.log(Object.keys(jack));
// console.log(person.hasOwnProperty("name")); //true
// console.log(user.hasOwnProperty("name")); //true
// console.log(jack.hasOwnProperty("name")); //false 原型链上的

test(person);
test(user);
test(jack);

const person1 = new Person();
person1.self = person1;
test(person1);

const arr1 = [1, 2];
arr1.push({ arr1 });
test(arr1);

const arr2 = [1];
arr2.push({
  a: [
    1,
    2,
    {
      b: arr2,
    },
  ],
});
test(arr2);

const arr3 = [1];
arr3.push({
  a: [
    1,
    2,
    {
      b: arr1,
    },
  ],
});
test(arr3);
