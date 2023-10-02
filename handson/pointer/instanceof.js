function myInstanceOf(obj, type) {
  let _obj = obj;
  while (_obj && _obj.__proto__) {
    console.log(1, _obj);
    _obj = _obj.__proto__;
    console.log(2, _obj);
    if (_obj.constructor === type) return true;
  }
  return false;
}

function testMyInstanceOf(obj, type) {
  const expect = obj instanceof type;
  const actual = myInstanceOf(obj, type);
  if (actual !== expect) {
    console.log({ obj, type, expect, actual });
  }
}

// testMyInstanceOf(null, Object);
// testMyInstanceOf(undefined, Object);
// testMyInstanceOf(0, Object);
testMyInstanceOf(1, Object);
// testMyInstanceOf(Number(0), Object);
// testMyInstanceOf(new Number(0), Object);
// testMyInstanceOf(false, Object);
testMyInstanceOf(true, Object);
// testMyInstanceOf(new Boolean(false), Object);
// testMyInstanceOf("1", Object);
// testMyInstanceOf(String, Object);
// testMyInstanceOf({}, Object);
// testMyInstanceOf(Object, Object);
// testMyInstanceOf(Object, Function);
