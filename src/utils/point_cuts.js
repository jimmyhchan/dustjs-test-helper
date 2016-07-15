function createProxy(before, fn, after) {
  return function() {
    var out;
    before.apply(this, arguments);
    out = fn.apply(this, arguments);
    after.apply(this, arguments);
    return out;
  };
}

module.exports = {
  createProxy: createProxy
};
