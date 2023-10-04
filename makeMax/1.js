/**
 * 只交换某个数字的两位，使其变得最大
 * @param {number} num 数字
 * @returns 转变后的数字
 */
function makeMax(num) {
  let array = num.toString().split("");
  let from = 0,
    to = 0;
  do {
    from = findMaxIndex(array, to);
    if (from !== to) break;
    to++;
  } while (to < array.length);
  if (to < array.length) {
    swap(array, from, to);
    // console.log({ num, from, to });
  }
  const result = +array.join("");
  // console.log({ num, result });
  return result;
}

function findMaxIndex(array, start) {
  let max = 0;
  let maxIndex = 0;
  for (let i = start; i < array.length; i++) {
    const n = +array[i];
    if (n > max) {
      max = n;
      maxIndex = i;
    }
  }
  return maxIndex;
}

function swap(array, from, to) {
  let tmp = array[from];
  array[from] = array[to];
  array[to] = tmp;
}

makeMax(0);
makeMax(1);
makeMax(11);
makeMax(112);
makeMax(8888);
makeMax(8881);
makeMax(8818);
makeMax(182818);
