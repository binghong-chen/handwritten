// https://github.com/mqyqingfeng/Blog/issues/13

// Otaku 御宅族，简称宅
function Otaku(name, age) {
  this.name = name;
  this.age = age;

  this.habit = "Games";

  return {
    name: name,
    habit: "Games",
  };
}

// 因为缺乏锻炼的缘故，身体强度让人担忧
Otaku.prototype.strength = 60;

Otaku.prototype.sayYourName = function () {
  console.log("I am " + this.name);
};

var person = new Otaku("Kevin", "18");

console.log(person.name); // Kevin
console.log(person.age); // undefined
console.log(person.habit); // Games
console.log(person.strength); // undefined
console.log(person.sayYourName); // undefined
// person.sayYourName(); // I am Kevin

function objectFactory() {
  var obj = new Object();
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  var ret = Constructor.apply(obj, arguments);
  return typeof ret === "object" ? ret : obj;
}

person = objectFactory(Otaku, "Kevin", "18");

console.log(person.name); // Kevin
console.log(person.age); // undefined
console.log(person.habit); // Games
console.log(person.strength); // undefined
console.log(person.sayYourName); // undefined
// person.sayYourName(); // I am Kevin
