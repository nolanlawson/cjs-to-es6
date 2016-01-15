cjs-to-es6
======

CLI to convert JavaScript files from CommonJS to ES6 modules (aka ES2015 modules, aka JavaScript modules, aka `import`/`export` instead of `require`/`module.exports`), using [5to6-codemod](https://github.com/5to6/5to6-codemod).

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

**Convert many files:**

    cjs-to-es6 foo.js bar.js baz.js

**Convert all files in a directory:**

    cjs-to-es6 lib/
    
The files are modified in-place.

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