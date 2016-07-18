/*eslint-env node, mocha */
var dustTestHelpers = require('../index');
// var dustTestHelpers = require('dustjs-test-helper');
var assert = require('chai').assert;
var sinon = require('sinon');
var myReplaceHelper = function(chunk, context, bodies) {
  // look for data inside the helper
  if (!bodies.block) {
    return chunk;
  }
  var bodyData = context.resolve(bodies.block);
  return chunk.write(bodyData.replace(/foo/g, 'bar'));
};


describe('test @replace', function() {
  var sandbox,
      chunkWriteSpy,
      contextResolveSpy,
      myHelper;

  before(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  myHelper = {
    name: 'replace',
    fn: myReplaceHelper, // replaces 'foo' in bodies.block with 'bar'
    before: function(chunk, context, bodies/*, params*/) {
      // spy on chunk.write
      chunkWriteSpy = sandbox.spy(chunk, 'write');
      contextResolveSpy = sandbox.spy(context, 'resolve');
      // stub out body
      bodies.block = function(){};
      sandbox.stub(bodies, 'block', function() {
        return 'foo foo';
      });
    }
  };
  it('should context resolve on body', function () {
    dustTestHelpers.helpers.test(myHelper, function(err, out) {
      // same as the dust render callback
      assert.notOk(err, 'should render without error');
      assert.equal(out, 'bar bar', 'final output should render');
    });
    assert(contextResolveSpy.calledOnce, 'body should have been resolved using context.resolve');
  });
  it('should chunk write the results', function () {
    dustTestHelpers.helpers.test(myHelper, function(err, out) {
      // same as the dust render callback
      assert.notOk(err, 'should render without error');
      assert.equal(out, 'bar bar', 'final output should render');
    });
    assert(chunkWriteSpy.calledWith('bar bar'), 'should write bar bar');
  });
});
