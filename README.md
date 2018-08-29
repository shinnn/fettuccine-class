# fettuccine-class

[![npm version](https://img.shields.io/npm/v/fettuccine-class.svg)](https://www.npmjs.com/package/fettuccine-class)
[![Build Status](https://travis-ci.org/shinnn/fettuccine-class.svg?branch=master)](https://travis-ci.org/shinnn/fettuccine-class)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/fettuccine-class.svg)](https://coveralls.io/github/shinnn/fettuccine-class)

A [class](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes) to create a new [`fettuccine`](https://github.com/shinnn/fettuccine) wrapper that defaults to given options.

Basically end users would rather use `fettuccine` directly, which covers most use cases. `fettucine-class` is designed for library authors to create an HTTP client interacting with a specific web service or API.

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

### instance.fetch(*url* [, *options*])

Same as [`fettuccine()`](https://github.com/shinnn/fettuccine#fettuccineurl--options), but uses options passed to the constructor by default.

```javascript
const packageInfo = new Fettuccine({
  baseUrl: 'https://registry.npmjs.org/'
});

(async () => {
  const {description} = await (await packageInfo.fetch('npm')).json();
  //=> 'a package manager for JavaScript'
})();
```

### instance.delete(*url* [, *options*]), instance.get(*url* [, *options*]),, instance.head(*url* [, *options*]), instance.patch(*url* [, *options*]), instance.post(*url* [, *options*]), instance.put(*url* [, *options*])

Set `options.method` to the corresponding method name and call `instance.fetch()`. In those function `options.method` is not configurable.

### instance.option

Default options used by `instance.fetch()`.

## License

[ISC License](./LICENSE) © 2018 Shinnosuke Watanabe
