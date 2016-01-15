cjs-to-es6
======

CLI to convert JavaScript files from CommonJS to ES6 modules (aka ES2015 modules, aka JavaScript modules, aka `import`/`export` instead of `require`/`module.exports`), using [5to6-codemod](https://github.com/5to6/5to6-codemod).

Installation
---

    npm install -g cjs-to-es6

Usage
---

```
Usage: index.js [ files/directories ... ]

Options:
  -h, --help  show help message                                        [boolean]
  --verbose   show verbose output                     [boolean] [default: false]
```

Convert a single file:

    cjs-to-es6 index.js

Convert many files:

    cjs-to-es6 foo.js bar.js baz.js

Convert all files in a directory:

    cjs-to-es6 lib/
    
The files are modified in-place.

Migrating from CommonJS to ES6 modules
--------

Not all CommonJS patterns have 1-to-1 equivalents in ES6 modules.
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
var exported = clownShoes ? new Clown() : new RespectableGentleman();
export default exported;
```

### `import`s also must be at the top level

This is invalid:

```js
try {
  import Nothing from 'bad-module';
} catch (err) {
  console.log('oh noes!');
}
```

There is no equivalent for this `try`/`catch` pattern in ES6 modules.