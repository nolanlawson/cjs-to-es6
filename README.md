cjs-to-es6
======

CLI to convert JavaScript files from CommonJS to ES6 modules (aka ES2015 modules, aka JavaScript modules, aka `import`/`export` instead of `require`/`module.exports`), using [5to6-codemod](https://github.com/5to6/5to6-codemod).

Usage
---

    npm install -g cjs-to-es6

Convert a file:

    cjs-to-es6 index.js

Convert many files:

    cjs-to-es6 foo.js bar.js baz.js

Convert all files in a directory:

    cjs-to-es6 lib/
    
It modifies the files in-place. That's it.