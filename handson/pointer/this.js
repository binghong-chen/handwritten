function User() {
  console.log("this", this);
}

User(); // window、global

new User(); //User {}
