# cjs-to-es6

CLI to convert JavaScript files from [CommonJS](http://www.commonjs.org/) to [ES6 / ES2015+](http://exploringjs.com/es6/ch_modules.html) format. The process isn't foolproof, but it can usually get you ~95% of the way there.

This tool uses [jscodeshift](https://github.com/facebook/jscodeshift) to run [5to6-codemod](https://github.com/5to6/5to6-codemod), [js-codemod](https://github.com/cpojer/js-codemod/) and [js-import-sort](https://github.com/Amwam/js-import-sort) under the hood. It's an opinionated migration to a format suitable for use in ES2015+ programs & scripts.

For extra safety, please consider using [standard](https://standardjs.com/) to sanitize your code.

## Install

### Install it locally (without npm / yarn)

```code
git clone (this repo)
(npm -g install / yarn global add) ./cjs-to-es6
```

### Install it from package

```bash
(npm install / yarn add) -g cjs-to-es6
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
