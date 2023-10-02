function getUsers(arg1, arg2) {
  if (arg1 === undefined) {
    console.log("查询所有用户");
    return;
  }
  const typeofArg1 = typeof arg1;
  if (typeofArg1 === "number") {
    if (arg2 === undefined) {
      console.log("按页码查询");
      return;
    }
    if (typeof arg2 === "number") {
      console.log("按页码和数量查询");
      return;
    }
    throw "参数错误";
  }
  if (typeofArg1 === "string") {
    if (arg2 === undefined) {
      console.log("按姓名查询");
      return;
    }
    if (typeof arg2 === "string") {
      console.log("按姓名和性别查询");
      return;
    }
    throw "参数错误";
  }
}

getUsers(); // 查询所有用户
getUsers(1); // 按页码查询
getUsers(1, 10); // 按页码和数量查询
getUsers("张"); // 按姓名查询
getUsers("张", "男"); // 按姓名和性别查询
