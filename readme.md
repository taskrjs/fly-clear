# fly-clear [![Build Status](https://travis-ci.org/flyjs/fly-clear.svg?branch=master)](https://travis-ci.org/flyjs/fly-clear)

> Remove one or multiple directories


## Install

```
$ npm install --save-dev fly-clear
```


## Usage

```js
exports.cleanup = function * (fly) {
  // single file
  yield fly.clear('foo.js');

  // single directory
  yield fly.clear('dist');

  // multiple directories
  yield fly.clear(['dist', 'build']);

  // glob pattern(s)
  yield fly.clear(['dist/*.css', 'dist/js/*']);

  // mixed
  yield fly.clear(['foo.js', 'build', 'dist/*.css']);

  // with options
  yield fly.clear('dist', {maxBusyTries: 5});
}
```


## API

### fly.clear(files, [options])

#### files

Type: `string` or `array`

A filepath, directory path, or glob pattern. For multiple paths, use an `array`.


#### options

Type: `object`<br>
Default: `{}`

All options are passed directly to `rimraf`. Please see its [documentation on options](https://github.com/isaacs/rimraf#options).


## License

MIT © [Luke Edwards](http://flyjs.io)
