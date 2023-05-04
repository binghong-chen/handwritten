const PubSub = require("./index");

const pubSub = new PubSub();

function onChange1() {
  console.log("onChange1", arguments);
}

function onChange2() {
  console.log("onChange2", arguments);
}

function onChange3() {
  console.log("onChange3", arguments);
}

pubSub.subscribe("onChange", onChange1);
pubSub.publish("onChange", 1, 2, "a", 3);
pubSub.subscribe("onChange", onChange2);
pubSub.publish("onChange", 1, 2, "b", 3);
pubSub.remove("onChange", onChange1);
pubSub.publish("onChange", 1, 2, "c", 3);
pubSub.subscribe("onChange", onChange3);
pubSub.publish("onChange", 1, 2, "d", 3);
pubSub.remove("onChange");
pubSub.publish("onChange", 1, 2, "e", 3);
