const p = new Proxy(
  {},
  {
    preventExtensions(target) {
      console.log("被拦截了");
      Object.preventExtensions(target);
      //如果目标对象是可扩展的，那么只能返回 false
      return true;
    },
  }
);

Object.preventExtensions(p);
Reflect.preventExtensions(p);

// https://blog.csdn.net/cuk0051/article/details/108340105
const dog = {};
dog.breed = "Siberian Husky";
dog.age = 12;
const newDog = Object.preventExtensions(dog);
dog.name = "Roger"; // 不能加属性
console.log(dog); //{ breed: 'Siberian Husky', age: 12 }
console.log(dog === newDog); //true
delete dog.age; // 但是可以删属性
console.log(dog); //{ breed: 'Siberian Husky' }
