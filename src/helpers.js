/**
 * test helpers for testing dust @helpers
 */

var dust = require('dustjs-linkedin');
var createProxy = require('./utils/point_cuts').createProxy;

var outs = {};

var tlNamePrefix = 'template_for_helper_test_';
function fakeTemplateRender(name, ctx, cb) {
  var tlName = tlNamePrefix + name;
  function body_0(chk, ctx) {
    // equivalent of `{@helperName/}`
    return chk.h(name, ctx, {}/*bodies*/, {}/*params*/);
  }
  body_0._dustBody = true;

  dust.register(tlName, body_0);
  return dust.render(tlName, ctx, cb);
}

/**
 * @param name - dust helper name
 * @param fn - the helper implementation
 */
function setup(name, before, fn, after) {
  // register a proxied helper into the dust global
  var proxiedFn = createProxy(before, fn, after);
  dust.helpers[name] = proxiedFn;
}

var noop = function(){};
outs.test = function(obj, cb) {
  var name = obj.name,
      fn = obj.fn,
      before = obj.before || noop,
      after = obj.after || noop,
      ctx = obj.ctx || {};
  var err;
  if (typeof name !== 'string') {
    err = new TypeError('invalid helper name provided. Received: ' + name);
  } else if (typeof fn !=='function') {
    err = new TypeError('invalid function implementation provided. Received: ' + fn);
  } else if (dust.helpers && dust.helpers[name]) {
    console.warn('helper name ' + name + ' already exists in helpers. It will be overwritten');
  }
  if (err) {
    cb(err,null);
  }
  setup(name, before, fn, after);
  return fakeTemplateRender(name, ctx, cb);
};

module.exports = outs;
