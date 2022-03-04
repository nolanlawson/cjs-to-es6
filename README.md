# cjs-to-es6

_**Maintenance notice:** this package is no longer under active maintenance._

CLI to convert JavaScript files from [CommonJS](http://www.commonjs.org/) to [ES6 / ES2015 modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) format. The process isn't foolproof, but it can usually get you ~95% of the way there.

This tool uses [jscodeshift](https://github.com/facebook/jscodeshift) to run [5to6-codemod](https://github.com/5to6/5to6-codemod) and [js-codemod](https://github.com/cpojer/js-codemod/) under the hood. It attempts to convert `require()` and `module.exports` / `exports` to `import` and `export`.

## Install

```bash
npm i -g cjs-to-es6
```

## Usage

```bash
cjs-to-es6 [ --verbose ] files/directories...
```

All files are modified in-place. You may want to review & rename them to the **.mjs** extension, if using [Node 14 or later](https://nodejs.org/docs/latest-v14.x/api/esm.html). Un-converted files should use the **.cjs** extension.

Examples:

```code
cjs-to-es6 index.js             # convert a single file
cjs-to-es6 lib/                 # convert all files in a directory & its subdirectories (.js & .cjs)
cjs-to-es6 foo.js bar.js lib/   # convert many files/directories
```
