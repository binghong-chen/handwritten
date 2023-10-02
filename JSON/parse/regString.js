const reg = /"(.*?)"/;

function test(text) {
  let expect = undefined;
  let error;
  try {
    expect = JSON.parse(text);
  } catch (e) {
    error = e;
  }
  let actual = undefined;
  const test = reg.test(text);
  let exec;
  if (text === null) {
    actual = null;
  } else {
    const test = reg.test(text);
    if (test) {
      exec = reg.exec(text);
      actual = exec[1];
    }
  }

  if (true || expect !== actual) {
    console.log({ text, error, expect, actual, test, exec });
  }
}

test();
test(null);
test("");
test('""');
test('"123"');
test('"123"   "');
test('    "123"   "');
test('  "123"');
test('"');
