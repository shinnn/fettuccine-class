# fettuccine-class

[![NPM version](https://img.shields.io/npm/v/fettuccine-class.svg)](https://www.npmjs.com/package/fettuccine-class)
[![Build Status](https://travis-ci.org/shinnn/fettuccine-class.svg?branch=master)](https://travis-ci.org/shinnn/fettuccine-class)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/fettuccine-class.svg)](https://coveralls.io/github/shinnn/fettuccine-class)
[![Dependency Status](https://david-dm.org/shinnn/fettuccine-class.svg)](https://david-dm.org/shinnn/fettuccine-class)
[![devDependency Status](https://david-dm.org/shinnn/fettuccine-class/dev-status.svg)](https://david-dm.org/shinnn/fettuccine-class#info=devDependencies)

A [class](http://exploringjs.com/es6/ch_classes.html) to create a new [`fettuccine`](https://github.com/shinnn/fettucine) wrapper that defaults to the given options.

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install fettuccine-class
```

## API

```javascript
const Fettuccine = require('fettuccine-class');
```

### instance = new Fettuccine([*options*])

*options*: `Object` (used as default options of instance methods)  
Return: `Object` (a [class](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes) instance)

### instance.options

Options that `instance.get()` uses by default.

```javascript
const instance1 = new Fettuccine();

instance1.options;
/* => {
     gzip: true,
     headers: {
       'user-agent': 'https://github.com/shinnn/fettuccine'
     }
   }
*/

const instance2 = new Fettucine({
  baseUrl: 'https://example.com/',
  encoding: null,
  gzip: false,
  headers: {
    'x-token': 'my-token'
  }
});

instance2.options;
/* => {
     gzip: false,
     baseUrl: 'https://example.com/',
     encoding: null,
     headers: {
       'x-token': 'my-token',
       'user-agent': 'https://github.com/shinnn/fettuccine'
     }
   }
*/
```

### instance.get()

Same as [`fettuccine()`](https://github.com/shinnn/fettuccine#fettuccineurl--options), but uses `instance.options` as default options.

```javascript
const instance = new Fettuccine({
  baseUrl: 'https://www.npmjs.com/package/'
});

instance.get('rimraf').then(response => {
  response.body;
  //=> '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <title>rimraf</title>\n ...'
});
```

### instance.post(), instance.put(), instance.patch(), instance.head(), instance.delete()

Set `options.method` to the method name and call `instance.get()`.

## License

Copyright (c) 2015 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
