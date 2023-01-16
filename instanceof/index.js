let Person  =function() {}
let Programmer  =function() {}
Programmer.prototype = new Person()
let nicole = new Programmer()

console.log(nicole.__proto__)
console.log(Programmer.prototype)

function Foo() {
}

function new_instance_of(leftValue, rightValue) {
    let rightProto = rightValue.prototype
    letftValue = leftValue.__proto__
    while(true) {
        if (leftValue === null) return false
        if (leftValue === rightProto) return true
        leftValue = leftValue.__proto__
    }
}

console.log(nicole instanceof Person)
console.log(nicole instanceof Programmer)
console.log(Object instanceof Object)
console.log(Function instanceof Function)
console.log(Function instanceof Object)
console.log(Foo instanceof Foo)
console.log(Foo instanceof Function)
console.log(Foo instanceof Object)


console.log(new_instance_of(nicole, Person))
console.log(new_instance_of(nicole, Programmer))
console.log(new_instance_of(Object, Object))
console.log(new_instance_of(Function, Function))
console.log(new_instance_of(Function, Object))
console.log(new_instance_of(Foo, Foo))
console.log(new_instance_of(Foo, Function))
console.log(new_instance_of(Foo, Object))

