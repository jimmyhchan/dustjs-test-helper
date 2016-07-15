/**
 * test helpers for testing dust {...|filters}
 */

var dust = require('dustjs-linkedin');
var createProxy = require('./utils/point_cuts').createProxy;

var outs = {};

var tlNamePrefix = 'template_for_filter_test_';
function fakeTemplateRender(filterName, ctx, cb) {
  var tlName = tlNamePrefix + filterName;
  var refName = 'key',
      isPath = false,
      defaultFilter = 'h'; // paths have dots in the reference name and will drill down the json
  function body_0(chk, ctx) {
    // equivalent of `{refName|filterName}`
    // NOTE: filter is not called if the refName key is not found in the context
    return chk.reference(ctx.get([refName], isPath), ctx, defaultFilter, [filterName]);
  }
  body_0._dustBody = true;

  dust.register(tlName, body_0);
  return dust.render(tlName, ctx, cb);
}

/**
 * @param name - dust filter name (the one that'll show up after the pipe)
 * @param fn - the filter implementation
 */
function setup(name, before, fn, after) {
  // register a proxied filter into the dust global
  var proxiedFn = createProxy(before, fn, after);
  dust.filters[name] = proxiedFn;
}

var noop = function(){};
outs.test = function(obj, cb) {
  var name = obj.name,
      fn = obj.fn,
      before = obj.before || noop,
      after = obj.after || noop,
      ctx = obj.ctx || {'key': 'lorem ipsum'};
  var err;
  if (typeof name !== 'string') {
    err = new TypeError('invalid filter name provided. Received: ' + name);
  } else if (typeof fn !=='function') {
    err = new TypeError('invalid function implementation provided. Received: ' + fn);
  } else if (dust.filters && dust.filters[name]) {
    console.warn('filter name ' + name + ' already exists in filters. It will be overwritten');
  }
  if (err) {
    cb(err,null);
  }
  setup(name, before, fn, after);
  return fakeTemplateRender(name, ctx, cb);
};

module.exports = outs;
