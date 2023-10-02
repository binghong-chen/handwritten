/**
 * 比较两个对象的字面量是否一致，未考虑循环引用
 * @param {any} obj1 比较对象1
 * @param {any} obj2 比较对象2
 * @param {boolean} strict 是否严格比较
 * @returns 是否一致
 */
function equal(obj1, obj2, strict = false) {
  const type = typeof obj1;
  if (type !== typeof obj2) {
    return false;
  }
  if (type === "object") {
    if (obj1 === null) return obj2 === null;
    if (obj2 === null) return obj1 === null;
    if (Array.isArray(obj1) !== Array.isArray(obj2)) {
      return false;
    }
    if (strict) {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
      // console.log({ keys1, keys2 });
      if (keys1.length !== keys2.length) return false;
      for (let key of keys1) {
        if (!equal(obj1[key], obj2[key])) return false;
      }
      return true;
    } else {
      if (Array.isArray(obj1)) {
        if (obj1.length !== obj2.length) return false;
        // [empty] 和 [undefined]
        // Object.keys()不能取到 empty
        for (let i = 0; i < obj1.length; i++) {
          if (!equal(obj1[i], obj2[i])) return false;
        }
        return true;
      }
      // {a: undefined} 和 {}
      for (let key of new Set([...Object.keys(obj1), ...Object.keys(obj2)])) {
        if (!equal(obj1[key], obj2[key])) return false;
      }
      return true;
    }
  }
  return Object.is(obj1, obj2);
}

function test(obj1, obj2, strict = false) {
  console.log(obj1, obj2, equal(obj1, obj2, strict), strict ? "strict" : "");
}

test();
test(null);
test(null, null);
test(null, undefined);
test(null, 0);
test(+0, -0);
test(-0, 0);
test(-0, +0);
test(+0, 0);
test(+0, +0);
test(0, 0);
test(-0, 0);
test(-0, -0);
test("0", 0);
test("0", "0");
test([], {});
test([], []);
test([], [1]);
test([], new Array());
test([], new Array(1));
test([], new Array(3));
test([, , ,], new Array(3));
test([1], [2]);
test([2], [2]);
test([[1]], [[1]]);
test([[1]], [[2]]);
test([[2], { a: [1, , 2] }], [[2], { a: [1, , 2] }]);
test([[2], { a: [1, undefined, 2] }], [[2], { a: [1, , 2] }]);
test({ a: 1, b: undefined }, { a: 1 });
test({ a: 1, b: undefined }, { a: 1 }, true);
test([], [undefined]);
test([], [undefined], true);
test(new Array(1), [undefined]);
test(new Array(1), [undefined], true);
