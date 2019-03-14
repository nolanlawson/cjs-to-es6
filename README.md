cjs-to-es6 (UNMAINTAINED)
======

CLI to convert JavaScript files from [CommonJS](http://www.commonjs.org/) to [ES6 modules](http://exploringjs.com/es6/ch_modules.html) (aka ES2015 modules, aka JavaScript modules, aka hipster `require()`). 

This tool uses [5to6-codemod](https://github.com/5to6/5to6-codemod) under the hood. It's basically just a thin convenience wrapper, which can process multiple files and convert both `import`s and `export`s.

Note that the process isn't foolproof, so you may have to manually tweak some things. But it can usually get you ~95% of the way there. See [migrating](#migrating-from-commonjs-to-es6-modules) below for some tips.

Usage
---

Install it:

```
npm install -g cjs-to-es6
```

Then run it:

```
cjs-to-es6 [ --verbose ] files/directories...
```

Examples:

```
cjs-to-es6 index.js             # convert a single file
cjs-to-es6 lib/                 # convert all files in a directory
cjs-to-es6 foo.js bar.js lib/   # convert many files/directories
```

All files are modified in-place.

Example input and output
--------

**In comes CommonJS:**

```js
var flimshaw = require('flimshaw');
var twentyEightSkidoo = require('twenty-eight').skidoo;

exports.flubTheDub = 'flubTheDub';
module.exports = 'zings';
```

**Out goes ES6 modules:**

```js
import flimshaw from 'flimshaw';
import {skidoo as twentyEightSkidoo} from 'twenty-eight';

export let flubTheDub = 'flubTheDub';
export default 'zings';
```

Migrating from CommonJS to ES6 modules
--------

Not all uses of CommonJS have a 1-to-1 equivalent in ES6 modules.
So you might have to correct some errors manually.

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

### `import`s also have to be at the top level

This is invalid:

```js
try {
  import MysteryModule from 'mystery-module';
} catch (err) {
  console.log("It's a mystery!");
}
```

There is no equivalent for this `try`/`catch` pattern in ES6 modules.
