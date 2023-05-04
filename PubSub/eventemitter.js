const EventEmitter = require("events").EventEmitter;

let events = new EventEmitter();

function eventsHandle() {
  console.log("绑定了一个事件");
}

events.on("eventsName", eventsHandle);
events.on("eventsName", eventsHandle);
events.once("eventsName", eventsHandle);
events.once("eventsName", eventsHandle);

events.emit("eventsName");
