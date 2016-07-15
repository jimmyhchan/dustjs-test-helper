/*eslint-env node, mocha */
'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var dustTestHelpers = require('../index');

// blah this feels wrong. this works in cjs becuase how require works but not sure how this will transpile for the browser
var dust = require('dustjs-linkedin');

describe('filter tester tests', function() {
  it('should have the basic api', function () {
    assert(typeof dustTestHelpers.filters !== 'undefined', 'the filters test helper is not defined');
    assert(typeof dustTestHelpers.filters.test === 'function', 'the test function in filters test helper is not defined');
  });
  it('should register a proxied helper when test is used', function (done) {
    var filterToTest = {
      name: 'example',
      fn: function(val) {
        return 'hello ' + val;
      },
      ctx: {
        key: 'joe'
      }
    };
    var test = dustTestHelpers.filters.test;
    test(filterToTest, function(err, out) {
      assert(!err, 'test errored trying to do a basic proxy registration');
      assert(typeof dust.filters[filterToTest.name] === 'function', 'the dust filter was not registered');
      assert(out === 'hello joe', 'output should prefix with hello');
      done();
    });
  });
  it('should allow arguments to be modified in before and after', function (done) {
    var filterToTest = {
      name: 'example',
      fn: function(val) {
        return val;
      },
      ctx: {
        key: 'joe'
      },
      before: sinon.spy(),
      after: sinon.spy()
    };
    var test = dustTestHelpers.filters.test;
    test(filterToTest, function(err) {
      assert(!err, 'test errored trying to do a basic proxy registration');
      assert(filterToTest.before.calledOnce, 'before was not called');
      assert(filterToTest.after.calledOnce, 'after was not called');
      done();
    });
  });
});
