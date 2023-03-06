function equal(a, b) {
  if (a === b) return true;
  if (a === undefined && b === null) return true;
  if (b === undefined && a === null) return true;
  const type = typeof a;
  if (type !== typeof b) return false;
  const aIsObj = a instanceof Object;
  const bIsObj = b instanceof Object;
  if (aIsObj && bIsObj) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    // 有可能 {a: undefined} 和 {}、[1, ,2] 和[1, undefined, 2]
    // if (aKeys.length !== bKeys.length) return false;
    for (let key of aKeys) {
      if (!equal(a[key], b[key])) return false;
    }
    for (let key of bKeys) {
      if (!equal(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
}

const pref = `__store_test__${new Date().getTime()}__`;

testSetAndGetAndLength();
testExpire();

function testExpire() {
  store.clear();
  [
    ,
    undefined,
    null,
    0,
    -1,
    200,
    1000,
    3000,
    false,
    true,
    "",
    "a",
    "2022",
    "2023",
    "2024",
    new Date(),
    new Date("aaa"),
    new Date().toString(),
    new Date(new Date().getTime() + 2000),
  ].forEach((expire, index) => {
    const key = `${pref}${index}`;
    let _expire = expire;
    let time = 0;
    if (typeof _expire === "string") {
      _expire = new Date(_expire);
    }
    if (_expire instanceof Date) {
      if (_expire.toString() !== "Invalid Date") {
        time = _expire.getTime() - new Date().getTime();
      }
    }
    if (Number.isFinite(_expire)) time = _expire;
    if (time < 0) time = 0;
    const value = [1, 2, { a: 1 }];
    store.set(key, value, expire);
    const getValue = store.get(key);
    if (!equal(getValue, value)) {
      console.log(`错误 expire=${JSON.stringify(expire)}`);
    }
    setTimeout(() => {
      const getValue = store.get(key);
      if (getValue !== null) {
        console.log(`清除错误1 expire=${JSON.stringify(expire)}`);
      }
      console.log(store.keys(), time);
      if (store.keys().includes(key)) {
        console.log(`清除错误2 expire=${JSON.stringify(expire)}`);
      }
      console.log(store.keys());
    }, time);
  });
  setTimeout(() => {
    store.clear();
  }, 10 * 1000);
}

function testRemoveAndClear() {}

function testSetAndGetAndLength() {
  const cases = [
    ,
    undefined,
    null,
    "",
    "null",
    "undefined",
    0,
    1,
    true,
    false,
    0.23,
    "abc",
    "123",
    {},
    { a: 1 },
    { a: 1, b: { c: "abc", d: [{ e: 3213 }] } },
    { a: 1, b: [1, 2, 3] },
    [],
    [1, 2, 3],
    [1, 2, , 3],
    [1, 2, undefined, 3],
  ];
  cases.forEach((value, index) => {
    const key = `${pref}${index}`;
    store.set(key, value);
    const getValue = store.get(key);
    if (!equal(value, getValue)) {
      console.log(index, value, getValue);
    }
  });
  const filtered = cases.filter((item) => ![undefined, null].includes(item));
  if (filtered.length !== store.length()) {
    console.log("长度错误", filtered, store.length());
  }
  store.clear();
  const all = store.getAll();
  if (!equal(all, {})) {
    console.log("getAll 不为空", all);
  }
  if (store.length() !== 0) {
    console.log(store.length());
  }
}
