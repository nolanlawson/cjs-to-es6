#!/usr/bin/env node

var lie = require('lie');
if (typeof Promise === 'undefined') {
  global.Promise = lie;
}
var denodeify = requre('denodeify');
var findit = denodeify(require('findit'));
var fs = require('fs');
var statAsync = denodeify(fs.stat);
var existsAsync = denodeify(fs.exists);
var exec = require('child-process-promise').exec;
var flatten = require('lodash.flatten');
var path = require('path');
var yargs = require('yargs')
  .usage('Usage: $0 [ files/directories ... ]')
  .boolean('h')
  .alias('h', 'help')
  .describe('h', 'this help message')
  .example('$0 index.js', 'convert a single file')
  .example('$0 lib/', 'convert all files in a directory')
  .example('$0 foo.js bar.js lib/', 'convert many files/directories')
  ;

var files = yargs.argv._;

if (yargs.argv.h || !files.length) {
  console.log('\ncjs-to-es6 v' + require('./package.json').version + ': ' +
    require('./package.json').description + '\n');
  yargs.showHelp();
  process.exit(0);
}

Promise.resolve().then(function () {
  return Promise.all(files.map(function (file) {
    file = path.resolve(file);
    return existsAsync(file).catch(function (exists) {
      if (!exists) {
        throw new Error('file not found: ' + file);
      }
    }).then(function () {
      return statAsync(file);
    }).then(function (stat) {
      if (stat.isDirectory()) {
        return findit(file);
      }
      return [file];
    });
  })).then(flatten);
}).then(function (files) {
  var cmd = require.resolve('es6-codemod/transforms/cjs.js');
  return exec(cmd, files)
}).catch(function (err) {
  console.log(err);
  process.exit(1);
});

files.ForEach(function (file) {
  file = path.resolve(file);
  if (!fs.existsSync(file)) {
    throw new Error('file not found: ' + file);
  }
  if (fs.statSync(file).isDirectory()) {
    return findit(file);
  }
  return file;
});