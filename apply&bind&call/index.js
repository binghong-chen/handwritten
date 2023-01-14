Function.prototype.myCall = function(context) {
    context = context || window
    let fn = Symbol(context)

    context[fn] = this
    context[fn](...[...arguments].slice(1))
    delete context[fn]
}

Function.prototype.myApply = function(context) {
    if (typeof context === 'undefined' || context === null) {
        context = window
    }
    let fn = Symbol(context)

    context[fn] = this
    context[fn](...arguments[1])
    delete context[fn]
}

Function.prototype.myBind = function(context) {
    let self = this
    return function() {
        return self.call(context, ...arguments)
    }
}


Function.prototype.myBind2 = function(context) {
    let self = this
    return function() {
        return self.myCall(context, ...arguments)
    }
}


function Person(name) {
    this.name = name;
  }
  Person.prototype.say = function (title, content) {
    console.log(`Hello, I'm ${this.name}, the title is ${title}, the content is ${content}`);
  };

var p1 = new Person("p1");
var p2 = new Person("p2");


p1.say.call(p2, 'title2', 'content2')
p1.say.myCall(p2, 'title2', 'content2')
p1.say.apply(p2, ['title2', 'content2'])
p1.say.myApply(p2, ['title2', 'content2'])
p1.say.bind(p2)('title2', 'content2')
p1.say.myBind(p2)('title2', 'content2')
p1.say.myBind2(p2)('title2', 'content2')
