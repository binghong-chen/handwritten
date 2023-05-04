class PubSub {
  constructor() {
    this.map = {};
  }

  subscribe(key, callback) {
    if (!this.map[key]) this.map[key] = [];
    this.map[key].push(callback);
  }

  publish(key, ...args) {
    if (!this.map[key]) return;
    this.map[key].forEach((callback) => callback(...args));
  }

  remove(key, callback) {
    if (!this.map[key]) return;
    if (!callback) this.map[key] = [];
    else this.map[key] = this.map[key].filter((item) => item !== callback);
  }
}

module.exports = PubSub;
