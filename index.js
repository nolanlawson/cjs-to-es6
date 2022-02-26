#!/usr/bin/env node

const colors = require('colors/safe')
const os = require('os')
const path = require('path')
const readdirp = require('readdirp')
const spawn = require('child-process-promise').spawn
const yargs = require('yargs')
  .options({
    h: {
      type: 'boolean',
      alias: ['h', 'help'],
      describe: 'show help message',
      default: false
    },
    v: {
      type: 'boolean',
      alias: ['v', 'verbose'],
      describe: 'show verbose output',
      default: false
    },
    p: {
      alias: ['p', 'parser'],
      type: 'string',
      describe: 'choose the parser that should be used with jscodeshift',
      choices: ['babel', 'babylon', 'flow', 'ts', 'tsx'],
      default: 'babel'
    }
  })
  .example([
    ['$0 index.js', 'convert a single file'],
    ['$0 lib/', 'convert all files in a directory'],
    ['$0 foo.js bar.js lib/', 'convert many files/directories']
  ])

const argv = yargs.argv
const filesToProcess = argv._

if (argv.h || !yargs) {
  console.log(`\ncjs-to-es6 v${require('./package.json').version}: ${require('./package.json').description}\n`)
  yargs.showHelp()
  process.exit(0)
}

function runCodeshift (transformName, files) {
  try {
    const cmd = require.resolve('jscodeshift/bin/jscodeshift.sh')
    const transform = path.resolve(`${process.cwd()}/${transformName}`)
    const child = spawn(cmd, ['-c', os.cpus.length, '--parser', argv.p, '-t', transform].concat(files))
    child.progress((childProcess) => {
      if (yargs.v) {
        childProcess.stdout.pipe(process.stdout)
      } else {
        childProcess.stdout.on('data', (data) => {
          if (/^Results: /.test(String(data))) {
            console.log(String(data).replace(/\n$/, ''))
          }
        })
      }
      childProcess.stderr.pipe(process.stderr)
    })
    return child
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

async function codeSwitching (files) {
  // Require -> Import
  console.log(`Transforming ${colors.yellow('require()')} to ${colors.cyan('import')} ...`)
  await runCodeshift('5to6-codemod/transforms/cjs.js', files)

  // module.exports -> Export
  console.log(`Transforming ${colors.yellow('module.exports')}/${colors.red('exports')} to ${colors.cyan('export')} ...`)
  await runCodeshift('5to6-codemod/transforms/exports.js', files)

  // Safe function to arrow conversion
  console.log(`Transforming (safely) ${colors.yellow('function ()')} to ${colors.cyan('() =>')} ...`)
  await runCodeshift('js-codemod/transforms/arrow-function.js', files)

  // Use const & let
  console.log(`Transforming ${colors.yellow('var')} to ${colors.red('const')} or ${colors.cyan('let')} ...`)
  await runCodeshift('js-codemod/transforms/no-vars.js', files)

  // Implement ES2015+ object shorthand
  console.log(colors.magenta('\nImplementing object shorthand...\n'))
  await runCodeshift('js-codemod/transforms/rm-object-assign.js', files)

  // Fix quoted properties
  console.log(colors.magenta('\nFixing quoted properties...\n'))
  await runCodeshift('js-codemod/transforms/unquote-properties.js', files)

  // Update computed properties
  console.log(colors.magenta('\nUpdating computed properties...\n'))
  await runCodeshift('js-codemod/transforms/updated-computed-props.js', files)

  // Convert lodash & underscore functions to ES2015+ native functions
  console.log(colors.magenta('\nConvert lodash & underscore to ES2015+ functions...\n'))
  await runCodeshift('js-codemod/transforms/underscore-to-lodash-native.js', files)
}

Promise.resolve().then(async () => {
  console.log(`${colors.rainbow('\nAhoy!')} ES6ifyin' your CommonJS for ya...`)
  const filesToLoad = []
  for (const item of filesToProcess) {
    try {
      for await (const entry of readdirp(item, { fileFilter: ['*.js', '*.cjs'] })) {
        filesToLoad.push(entry.fullPath)
      }
    }
    catch {
      filesToLoad.push(path.resolve(item))
    }
  }
  return filesToLoad
}).then(async (files) => {
  console.log(`\nFound ${colors.cyan(files.length.toString())} files.`)
  return codeSwitching(files)
}).catch((err) => {
  if (err.errno === 'E2BIG') {
    throw new Error('Sorry, too many files at once')
  }
  throw err
}).then(() => {
  console.log(colors.rainbow('\nES6ification complete!'))
  if (!argv.v) {
    console.log(`Re-run with ${colors.cyan('--verbose')} to see full output.`)
  }
  console.log()
}).catch((err) => {
  console.error(err.stack)
  process.exit(1)
})
