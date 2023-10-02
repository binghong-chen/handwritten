function User() {
  console.log(new.target);
}

User(); // undefined
new User(); // [Function: User]
