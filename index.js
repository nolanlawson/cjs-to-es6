#!/usr/bin/env node

const colors = require('colors/safe')
const os = require('os')
const path = require('path')
const readdirp = require('readdirp')
const spawn = require('child-process-promise').spawn
const yargs = require('yargs')
  .options({
    v: {
      type: 'boolean',
      alias: ['verbose'],
      describe: 'show verbose output',
      default: false
    },
    p: {
      alias: ['parser'],
      type: 'string',
      describe: 'the parser that should be used with jscodeshift',
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

if (!filesToProcess.length) {
  yargs.showHelp()
  process.exit(0)
}

function runCodeshift (transformName, files) {
  try {
    const cmd = require.resolve('jscodeshift/bin/jscodeshift.sh')
    const transform = require.resolve(transformName)
    const child = spawn(cmd, ['-c', os.cpus.length, '--parser', argv.p, '-t', transform].concat(files))
    child.progress((childProcess) => {
      if (argv.v) {
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
}

Promise.resolve().then(async () => {
  console.log(`${colors.rainbow('\nAhoy!')} ES6ifyin' your CommonJS for ya...`)
  const filesToLoad = []
  for (const item of filesToProcess) {
    try {
      for await (const entry of readdirp(item, { fileFilter: ['*.js', '*.cjs'] })) {
        filesToLoad.push(entry.fullPath)
      }
    } catch {
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
