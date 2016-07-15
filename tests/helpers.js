/*eslint-env node, mocha */
'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var dustTestHelpers = require('../index');

// blah this feels wrong. this works in cjs becuase how require works but not sure how this will transpile for the browser
var dust = require('dustjs-linkedin');


describe('helper tester tests', function() {
  it('should have the basic api', function () {
    assert.notEqual(typeof dustTestHelpers.helpers, 'undefined', 'the helpers test helper is not defined');
    assert.equal(typeof dustTestHelpers.helpers.test, 'function', 'the test function in helpers test helper is not defined');
  });
  it('should register a proxied helper when test is used', function (done) {
    var helperToTest = {
      name: 'example',
      fn: function(chk) {
        return chk.write('hello');
      }
    };
    var test = dustTestHelpers.helpers.test;
    test(helperToTest, function(err, out) {
      assert(!err, 'test errored trying to do a basic proxy registration');
      assert.equal(typeof dust.helpers[helperToTest.name], 'function', 'the dust helper was not registered');
      assert.equal(out, 'hello', 'output should be hello');
      done();
    });
  });
  it('should call before and after', function (done) {
    var helperToTest = {
      name: 'example',
      fn: function(chk) {
        return chk;
      },
      before: sinon.spy(),
      after: sinon.spy()
    };
    var test = dustTestHelpers.helpers.test;
    test(helperToTest, function(err) {
      assert(!err, 'test errored trying use before and after');
      assert(helperToTest.before.calledOnce, 'before was not called');
      assert(helperToTest.after.calledOnce, 'after was not called');
      done();
    });
  });
  it('should allow arguments to be modified in before and after', function (done) {
    var chkEndSpy;
    var helperToTest = {
      name: 'example',
      fn: function(chk, ctx, bodies, params) {
        return chk.write(params.a + ' ' +  ctx.get('foo'));
      },
      before: function(chk, ctx, bodies, params){
        // add a="param a" into the params object
        params.a = 'param a';
        // add foo: 123 into ctx.stack.head
        ctx.stack.head.foo = 123;
        // add a spy on chunk.end
        chkEndSpy = sinon.spy(chk, 'end');
      },
      after: sinon.spy()
    };
    var test = dustTestHelpers.helpers.test;
    test(helperToTest, function(err, out) {
      assert(!err, 'test errored trying to modify arguments using before and after');
      assert.equal(out, 'param a 123', 'param setting or context modifying did  not work');
      assert(chkEndSpy.called, 'setting spy inside before should have worked');
      done();
    });
  });
});
