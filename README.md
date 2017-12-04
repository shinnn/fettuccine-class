# fettuccine-class

[![npm version](https://img.shields.io/npm/v/fettuccine-class.svg)](https://www.npmjs.com/package/fettuccine-class)
[![Build Status](https://travis-ci.org/shinnn/fettuccine-class.svg?branch=master)](https://travis-ci.org/shinnn/fettuccine-class)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/fettuccine-class.svg)](https://coveralls.io/github/shinnn/fettuccine-class)
[![dependencies Status](https://david-dm.org/shinnn/fettuccine-class/status.svg)](https://david-dm.org/shinnn/fettuccine-class)
[![dependencies Status](https://david-dm.org/shinnn/fettuccine-class/status.svg)](https://david-dm.org/shinnn/fettuccine-class)

A [class](http://exploringjs.com/es6/ch_classes.html) to create a new [`fettuccine`](https://github.com/shinnn/fettuccine) wrapper that defaults to the given options.

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```
npm install fettuccine-class
```

## API

```javascript
const Fettuccine = require('fettuccine-class');
```

### instance = new Fettuccine([*options*])

*options*: `Object` (used as default options of instance methods)  
Return: `Object`

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

const instance2 = new Fettuccine({
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

(async () => {
  const {body} = instance.get('rimraf');
  //=> '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <title>rimraf</title>\n ...'
})();
```

### instance.post(), instance.put(), instance.patch(), instance.head(), instance.delete()

Set `options.method` to the method name and call `instance.get()`.

## License

[ISC License](./LICENSE) © 2017 Shinnosuke Watanabe
