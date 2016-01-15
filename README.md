cjs-to-es6
======

CLI tool to convert JavaScript files from [CommonJS](http://www.commonjs.org/) to [ES6 modules](http://exploringjs.com/es6/ch_modules.html) (aka ES2015 modules, aka JavaScript modules, aka hipster `require()`). Uses [5to6-codemod](https://github.com/5to6/5to6-codemod).

Usage
---

```
npm install -g cjs-to-es6
```

Then:

```
cjs-to-es6 [ --verbose ] files/directories...
```

**Convert a single file:**

    cjs-to-es6 index.js

**Convert all files in a directory:**

    cjs-to-es6 lib/

**Convert many files/directories:**

    cjs-to-es6 foo.js bar.js lib/

All files are modified in-place.

Example input/output
----

**Input:**

```js
var flimshaw = require('flimshaw');
var twentyEightSkidoo = require('twenty-eight').skidoo;

exports.flubTheDub = 'flubTheDub';
module.exports = 'zings';
```

**Output:**

```js
import flimshaw from 'flimshaw';
import {skidoo as twentyEightSkidoo} from 'twenty-eight';

export let flubTheDub = 'flubTheDub';
export default 'zings';
```

Migrating from CommonJS to ES6 modules
--------

Not all CommonJS usages have a 1-to-1 equivalent in ES6 modules.
So you may have to correct some errors manually.

Use `--verbose` to get detailed output, or follow these general tips:

### `export`s must be at the top level

This is invalid:

```js
if (clownShoes) {
  export default new Clown();
} else {
  export default new RespectableGentleman();
}
```

Instead do:

```js
var result = clownShoes ? new Clown() : new RespectableGentleman();
export default result;
```

### `import`s also must be at the top level

This is invalid:

```js
try {
  import MysterModule from 'mystery-module';
} catch (err) {
  console.log("It's a mystery!");
}
```

There is no equivalent for this `try`/`catch` pattern in ES6 modules.