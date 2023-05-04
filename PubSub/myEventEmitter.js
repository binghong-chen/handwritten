class PubSub {
  constructor() {
    this.map = {};
  }

  on(key, callback) {
    if (!this.map[key]) this.map[key] = [];
    this.map[key].push(callback);
  }

  emit(key, ...args) {
    if (!this.map[key]) return;
    this.map[key].forEach((callback) => callback(...args));
  }

  off(key, callback) {
    if (!this.map[key]) return;
    if (!callback) this.map[key] = [];
    else this.map[key] = this.map[key].filter((item) => item !== callback);
  }

  once(key, callback) {
    // TODO
    // this.off(key, callback);
  }
}

module.exports = PubSub;
