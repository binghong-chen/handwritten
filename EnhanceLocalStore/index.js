const store = {
  get(key) {
    var res = localStorage.getItem(key);
    if (res === null) return res;
    var match = res.match(/^expire=(.+);/);
    if (match !== null) {
      const expire = match[1];
      if (new Date() > new Date(expire)) {
        localStorage.removeItem(key);
        return null;
      }
      res = res.substring(expire.length);
    }
    try {
      var json = JSON.parse(res);
      return json;
    } catch (e) {
      return res;
    }
  },
  set(key, value, expire) {
    if (value === null || value === undefined) return;
    if (Number.isFinite(expire)) {
      expire = new Date(new Date().getTime() + expire);
    } else if (typeof expire === "string") {
      expire = new Date(expire);
    }
    if (!(expire instanceof Date) || expire.toString() !== "Invalid Date") {
      expire = "";
    } else {
      expire = `expire=${expire};`;
    }

    value = JSON.stringify(value);
    localStorage.setItem(key, `${expire}${value}`);
  },
  getAll() {
    const res = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      res[key] = get(key);
    }
    return res;
  },
  remove(key) {
    if (key instanceof Array) key.forEach(this.remove);
    if (typeof key === "string") localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  },
  length() {
    return localStorage.length;
  },
  keys() {
    const res = [];
    for (let i = 0; i < localStorage.length; i++) res.push(localStorage.key(i));
    return res;
  },
};
