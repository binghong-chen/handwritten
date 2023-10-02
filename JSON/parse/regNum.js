const reg = /^[\s]*-?\d+(\.\d+)?[\s]*$/;

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
  if (test) {
    actual = parseFloat(text);
  }
  if (expect !== actual) {
    console.log({ text, error, expect, actual, test });
  }
}

test("");
test("  ");
test("1");
test("   1  ");
test("+1");
test("11");
test("1.");
test("1.1");
test(".1");
test("-1");
test("-11");
test("-.");
test("-.1");
test("-1.");
test("-1.1");
test("-1.1   ,  ");
test(`


      -1.1    
      
         `);

// console.log(/\B/.test(" "));
// console.log(/\s/.test(" "));
// console.log(/\S/.test(" "));
