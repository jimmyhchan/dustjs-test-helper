# dustjs-test-helper
> Test helpers to help test custom extensions (custom helpers, filter, etc.) of [dustjs-linkedin](https://github.com/linkedin/dustjs).

- lets you focus on unit testing
- `before` and `after` hooks so you can modify or spy on the chunk, context, params, etc internals
- does the boilerplate work of faking a template to exercise your extension
- no dependency on the compiler

## Install
```
$ npm install --save-dev dustjs-test-helper
```
Note: the test helper has a peer-dependency on dustjs-linkedin, which means you should have it installed in your repo as a dependency/dev dependency

## Usage
you will likely want to use the `test` method. There is one specific for testing Dust's `@helpers` and a different one for Dust filters.
> @see tests/example for an example using sinon, mocha and chai.

## API
### dustTester.helpers.test
```
var dustTester = require('dustjs-test-helper');
dustTesters.helpers.test(setupObject, function(err, out) {
  // same as a dust.render callback
});
```
test a custom helper using the fake template `{@setupObjectName/}`. use `before` hooks to modify this further.

### dustTester.filters.test
```
var dustTester = require('dustjs-test-helper');
dustTesters.filters.test(setupObject, function(err, out) {
  // same as a dust.render callback
});
```
test a custom filter using the fake template `{key|setupObjectName}`. use `before` hooks to modify this further.

#### setupObject
Type: `object`

##### setupObject.name

Type:`string`

name of the @helper or |filter. Dust looks for this name in the `dust.helpers` and `dust.filters` objects and also matches what is used in the template
##### setupObject.fn

Type:`function`

the implementation of the helper or filter. The helper function signature is (chunk, context, bodies, params) while the filter function signature is (data)

##### setupObject.before

Type:`function`
Default: `function(){}`

hook to be called before `fn`. gets the same params. useful for spying, setup, modifying, etc.

##### setupObject.after

Type:`function`
Default: `function(){}`

hook to be called after `fn`. gets the same params. useful for asserting, doing cleanup, etc.

##### setupObject.ctx

Type:`object`
Default: `{}`

context used to render the fake template

## License
MIT [jimmyhchan]
