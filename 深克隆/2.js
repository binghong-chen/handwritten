// 考虑循环引用

function deepClone(data) {
  const map = new Map();
  // arguments.callee 不能用箭头符号，不然取到的是deepClone
  return (function (data) {
    if (data instanceof Date) return new Date(data);
    if (data instanceof RegExp) return new RegExp(data);
    if (typeof data !== "object") return data;
    if (data === null) return null;
    if (map.has(data)) return map.get(data);
    let clone;
    if (Array.isArray(data)) {
      clone = [];
      map.set(data, clone);
      clone.push(...data.map(arguments.callee));
    } else {
      clone = {};
      // data -> clone
      map.set(data, clone);
      for (let key in data) {
        clone[key] = arguments.callee(data[key]);
      }
    }
    return clone;
  })(data);
}

function testFactory(data, fn1, fn2, fn3) {
  const clone = deepClone(data);
  if (
    (typeof fn1 === "function" && !fn1(data, clone)) ||
    (typeof fn2 === "function" && (!fn2(data) || !fn2(clone))) ||
    (typeof fn3 === "function" && fn3(data) !== fn3(clone))
  ) {
    console.log({ data, clone });
  }
}

const testNonCircle = (data) => {
  const type = typeof data;
  testFactory(
    data,
    (data, clone) => {
      if (type !== "object") return true;
      if (data === null) return clone === null;
      if (data === clone) return false;
      return true;
    },
    null,
    (data) => {
      if (type === "object") return JSON.stringify(data);
      return data;
    }
  );
};

// 测试 简单数据

testNonCircle();
testNonCircle(null);
testNonCircle("");
testNonCircle(0);
testNonCircle(1);
testNonCircle(false);
testNonCircle(true);
testNonCircle(new Date());
testNonCircle(/abc/g);
testNonCircle([]);
testNonCircle({});
testNonCircle({ a: 1 });
testNonCircle({ a: [] });
testNonCircle({ a: [1, 2, 3] });
testNonCircle({ a: [1, null, 3] });
testNonCircle({ a: [1, { b: true, c: { aaa: 1 } }, 3] });
testNonCircle(console.log);

let data = [1, { a: 2 }, ["a", "b"]];
let clone = deepClone(data);
testNonCircle(data);

// 测试 循环引用

const testCircle1 = (data) =>
  testFactory(
    data,
    (data, clone) => {
      if (data === clone) return false;
      if (Object.keys(data).join(",") !== Object.keys(clone).join(","))
        return false;
      return true;
    },
    (data) => {
      if (data.self !== data) return false;
      return true;
    }
  );

data = { self: undefined };
data.self = data;
clone = deepClone(data);
testCircle1(data);

data = { value: 1, self: undefined };
data.self = data;
clone = deepClone(data);
testCircle1(data);

const testCircle2 = (data) =>
  testFactory(
    data,
    (data, clone) => {
      if (data === clone) return false;
      if (Object.keys(data).join(",") !== Object.keys(clone).join(","))
        return false;
      if (data.firstChild.value !== clone.firstChild.value) return false;
      if (data.children.length !== clone.children.length) return false;
      if (
        data.children.map((child) => child.value).join(",") !==
        data.children.map((child) => child.value).join(",")
      )
        return false;
      return true;
    },
    (data) => {
      if (data.self !== data) return false;
      if (data.firstChild.parent !== data) return false;
      if (data.children.some((child) => child.parent !== data)) return false;
      return true;
    }
  );

data = {
  value: 1,
};
data.self = data;
data.children = [2, 3, 4].map((value) => ({ value, parent: data }));
data.firstChild = data.children[0];
testCircle2(data);

const testCircle3 = (data) =>
  testFactory(
    data,
    (data, clone) => {
      if (data === clone) return false;
      if (Object.keys(data).join(",") !== Object.keys(clone).join(","))
        return false;
      if (data.firstChild.value !== clone.firstChild.value) return false;
      if (data.children.length !== clone.children.length) return false;
      if (
        data.children.map((child) => child.value).join(",") !==
        data.children.map((child) => child.value).join(",")
      )
        return false;

      return true;
    },
    (data) => {
      if (data.self !== data) return false;
      if (data.firstChild.parent !== data) return false;
      if (data.children.some((child) => child.parent !== data)) return false;
      if (data.value !== 1) return false;
      return true;
    }
  );

data = {
  value: 1
};
data.self = data;
data.children = [2, 3, 4].map((value) => ({ value, parent: data }));
data.firstChild = data.children[0];
data.firstChild.child = {
  value: 10,
  parent: data.firstChild,
  grandParent: data,
},
testCircle3(data);
