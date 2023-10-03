const JSON1 = {
  parse(text) {
    if (text === null) return null;
    text = text + ""; // undefined -> 'undefined'
    let position = 0;
    function parseKeyword() {
      for (let value of [null, true, false]) {
        const valueStr = value + "";
        if (!checkChar(valueStr[0])) continue;
        for (let char of valueStr.slice(1)) {
          checkUnexpectedEnd();
          if (char !== text[position]) throwUnexpectedToken();
          position++;
        }
        return value;
      }
    }
    function parseNumber() {
      let begin = position;
      if (checkChar("-")) {
        checkUnexpectedEnd(); //-
        if (!/\d/.test(text[position])) throwUnexpectedToken(); //-\t
      }
      let isNumber = false;
      while (/\d/.test(text[position])) {
        isNumber = true;
        position++;
        if (checkChar(".")) checkUnexpectedEnd(); //1.
      }
      if (isNumber) return +text.substring(begin, position);
    }
    function parseString() {
      if (!checkChar('"')) return;
      const begin = position;
      do checkUnexpectedEnd();
      while ('"' !== text[position++]);
      return text.substring(begin, position - 1);
    }
    function parseArray() {
      if (!checkChar("[")) return;
      jumpSpaceAndCheckEnd(); //[
      const result = [];
      if (checkChar("]")) return result; // []、[  ]
      let item;
      while ((item = parseAll()) !== undefined) {
        result.push(item);
        jumpSpaceAndCheckEnd();
        if (checkChar("]")) return result;
        checkChar(",");
      }
    }
    function parseObject() {
      if (!checkChar("{")) return;
      jumpSpaceAndCheckEnd(); //{ {
      const result = {};
      if (checkChar("}")) return result; // {}、{    }
      let key;
      while ((key = parseString()) !== undefined) {
        jumpSpaceAndCheckEnd();
        checkChar(":");
        const value = parseAll();
        if (value === undefined) throwUnexpectedToken();
        result[key] = value;
        jumpSpaceAndCheckEnd();
        if (checkChar("}")) return result;
        checkChar(","); // {"a": 1  ,
      }
    }
    function checkChar(char) {
      const result = char === text[position];
      if (result) position++;
      if (",:".includes(char)) {
        if (!result) throwUnexpectedToken(); //[123 4] {"a"}
        jumpSpaceAndCheckEnd();
      }
      return result;
    }
    function jumpSpace() {
      while (/\s/.test(text[position])) position++;
    }
    function jumpSpaceAndCheckEnd() {
      jumpSpace();
      checkUnexpectedEnd();
    }
    function throwUnexpectedToken() {
      const char = text[position];
      let type = `token ${char}`;
      if (char === '"') type = "string";
      if (/[-\d]/.test(char)) type = "number";
      throw SyntaxError(`Unexpected ${type} in JSON at position ${position}`);
    }
    function throwUnexpectedEnd() {
      throw SyntaxError("Unexpected end of JSON input");
    }
    function checkUnexpectedEnd() {
      if (position === text.length) throwUnexpectedEnd();
    }
    function parseAll() {
      jumpSpaceAndCheckEnd();
      let result;
      if ((result = parseKeyword()) !== undefined) return result;
      if ((result = parseNumber()) !== undefined) return result;
      if ((result = parseString()) !== undefined) return result;
      if ((result = parseArray()) !== undefined) return result;
      if ((result = parseObject()) !== undefined) return result;
    }
    const result = parseAll();
    jumpSpace();
    if (position < text.length) throwUnexpectedToken();
    return result;
  },
};

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

function getResult(func, obj) {
  try {
    return func(obj);
  } catch (e) {
    return e.message;
  }
}

function test(text) {
  const expect = getResult(JSON.parse, text);
  const actual = getResult(JSON1.parse, text);
  //   if (typeof expect === "string") {
  //     console.log({ text, expect, actual });
  //   }
  if (!equal(expect, actual)) {
    console.error({ text, expect, actual });
  }
}

function testCases() {
  test();
  testKeyword();
  testNumber();
  testString();
  testArray();
  testObject();
  test(Symbol);
  test(Symbol());
  test(`
  a: 123
  `);
}

function testKeyword() {
  test(null);
  test(true);
  test(JSON.stringify(true));
  test("    true    ");
  test("    true   123 ");
  test("   null");
  test("   nu");
  test("    tru");
  test("    tr");
  test("    t");
  test("    f");
  test("    f1");
  test("    false1");
  test("TRUE");
  test("tRUE");
  test("Null");
  test("Nul");
  test("[True]");
  test('{"a":');
  test('{"a":}');
  test('{"a":T}');
  test('{"a":tR}');
}

function testNumber() {
  test("0");
  test("   123   ");
  test("   123   123");
  test("+");
  test("-");
  test("-\t");
  test("- ");
  test("-  ");
  test("-a");
  test(".");
  test("0a");
  test("0..");
  test("1.");
  test(".1");
  test(".1.");
  test("+.");
  test("+.1");
  test("+0.1");
  test("+1");
  test("-1");
  test("-.0");
  test(1);
  test("1234,567");
  test("1234    ");
  test(JSON.stringify(1.231232e12));
}

function testString() {
  test('"');
  test("");
  test(" ");
  test("a");
  test("");
  test('""');
  test('"123"');
  test('"123"   "');
  test('  "123"');
  test('"chenbinghong"');
  test('"chenbinghong');
}

function testArray() {
  test("[");
  test("[    ");
  test("[\t\t");
  test("]");
  test("[]");
  test([]);
  test("[123 -]");
  test("[123 -1]");
  test("[123 .]");
  test("[[][]]");
  test("[[],  [123    233]]");
  test("[]]");
  test("[123");
  test("1234]");
  test('["abc 123"]');
  test('["abc 123"1]');
  test('["abc 123"]1');
  test('["abc""]');
  test(JSON.stringify([undefined, null]));
  test(JSON.stringify([null]));
  test(JSON.stringify([123]));
  test(JSON.stringify([true]));
  test(JSON.stringify([false]));
  test(" [         \t]");
  test(" {         \t}   ");
  test("[,");
  test("[,]");
  test("[]]");
  test("[[]]");
  test("[[]]]");
  test(
    JSON.stringify([[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]])
  );
  test("[null,1]");
  test("[null,und]");
  test(
    JSON.stringify([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ])
  );
  test(JSON.stringify([[1112311321]]));
  test(JSON.stringify([[1112311321], 1231312]));
}

function testObject() {
  test("}");
  test("{");
  test("{   ");
  test("{}");
  test({});
  test("1234}");
  test("1234  }");
  test('{"a": 123,   }');
  test('{"a": 123 456}');
  test('   {  "   [a bc ] "   :    \t    123   }');
  test('    "" ');
  test('   {  "   [a bc ] "   :    \t    123  " }');
  test('   {  "   [a bc ] "   :    \t    123  "\r\n }');
  test('   {  "   [a bc ] "   :    \t    123  ,  \r\n []}');
  test('{""}');
  test("{");
  test('{"');
  test('{"a');
  test('{"a"');
  test('{"a":');
  test('{"a":"');
  test('{"a":""');
  test('{"a":""}');
  test("{}");
  test('{"}');
  test('{"a}');
  test('{"a"}');
  test('{"a":}');
  test('{"a":"}');
  test('{"a":""}');
  test('{"a"}');
  test("{,");
  test("{,}");
  test('{"a": 1,}');
  test('{"a": 1');
  test('{"a": 1,');
  test('{"a": 1  ,  ');
  test(JSON.stringify({ a: true }));
  test(JSON.stringify({ a: { b: 1 } }));
  test(
    JSON.stringify([123, { a: { b: [] } }, { c: true, d: -333.222, e: "abcd" }])
  );
}

function testUnExceptionEnd() {
  test("123 {}");
  test("123 [");
  test("123 true");
  test("123 null");
}

testCases();
