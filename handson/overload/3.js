function getUsers(...args) {
  const key = "_fn-" + args.map((arg) => typeof arg).join("-");
  const fn = getUsers[key];
  if (typeof fn !== "function") return;
  fn(...args);
}

getUsers.addImpl = function (...args) {
  if (args.length === 0) return;
  const fn = args[args.length - 1];
  if (typeof fn !== "function") return;
  const _args = [...args];
  _args.pop();
  const key = "_fn-" + _args.join("-");
  this[key] = fn;
};

getUsers.addImpl(() => {
  console.log("查询所有用户");
});

getUsers.addImpl("number", (pageNo) => {
  console.log("按页码查询", pageNo);
});

getUsers.addImpl("number", "number", (pageNo, pageSize) => {
  console.log("按页码和数量查询", pageNo, pageSize);
});

getUsers.addImpl("string", (name) => {
  console.log("按姓名查询", name);
});

getUsers.addImpl("string", "string", (name, sex) => {
  console.log("按姓名和性别查询", name, sex);
});

getUsers(); // 查询所有用户
getUsers(1); // 按页码查询
getUsers(1, 10); // 按页码和数量查询
getUsers("张"); // 按姓名查询
getUsers("张", "男"); // 按姓名和性别查询
getUsers("张", 1); // 按姓名查询

console.log(getUsers);
