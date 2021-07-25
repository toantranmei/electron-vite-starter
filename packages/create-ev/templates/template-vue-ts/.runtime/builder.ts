'use strict'
process.env.NODE_ENV = 'production'

import chalk from 'chalk'
import MultiSpinner from 'multispinner'
import { rollup, OutputOptions } from 'rollup'
import { say } from 'cfonts'
import { sync } from 'del'
import { build } from 'vite'

// Setup options
import rendererOptions from './vite.config'
import rollupConfigOptions from './rollup.config'

const doneLog = chalk.bgGreen.white(' DONE ')
const errorLog = chalk.bgRed.white(' ERROR ')
const okLog = chalk.bgBlue.white(' OK ')

function buildWeb() {
  sync(['dist/web/*', '!.gitkeep'])
  build(rendererOptions()).then(() => {
    console.log(`${doneLog} - RendererProcess build success`)
    process.exit()
  })
}

function clean() {
  sync([
    'dist/electron/main/*',
    'dist/electron/renderer/*',
    'dist/web/*',
    'build/*',
    '!build/icons',
    '!build/lib',
    '!build/lib/electron-build.*',
    '!build/icons/icon.*',
  ])
  console.log(`\n${doneLog} - Clear done`)
  process.exit()
}

function sayHi() {
  const cols = process.stdout.columns
  let text: string | boolean = ''

  if (cols > 85) text = `Electron+Builder`
  else if (cols > 60) text = `Electron+|Builder`
  else text = false

  if (text) {
    say(text, {
      colors: ['yellow'],
      font: 'simple3d',
      space: false,
    })
  } else console.log(chalk.yellow.bold(`\n  Electron+Builder`))
}

function init() {
  sayHi()

  sync([
    'dist/electron/main/*',
    'dist/electron/renderer/*',
    'build/*',
    '!build/icons',
    '!build/lib',
    '!build/lib/electron-build.*',
    '!build/icons/icon.*',
  ])

  const tasks = ['main', 'renderer']

  const multiTasks = new MultiSpinner(tasks, {
    preText: 'building',
    postText: 'process',
  })

  let results = ''

  multiTasks.on('success', () => {
    process.stdout.write('\x1B[2J\x1B[0f')
    console.log(`\n\n${results}`)
    console.log(
      `${okLog} - Take it away ${chalk.yellow('`electron-builder`')}\n`
    )
    process.exit()
  })

  // @ts-ignore: i don't have idea for that, u can fix that, if can, i hope so :(((
  const rollupOutputOptions: OutputOptions = rollupConfigOptions(
    process.env.NODE_ENV
  ).output

  // Main process builder by rollup
  rollup(rollupConfigOptions(process.env.NODE_ENV))
    .then((build) => {
      results += `${doneLog} - MainProcess build success` + '\n\n'

      build.write(rollupOutputOptions).then(() => {
        multiTasks.success('main')
      })
    })
    .catch((error) => {
      multiTasks.error('main')
      console.log(`\n  ${errorLog} - Failed to build main process`)
      console.error(`\n${error}\n`)
      process.exit(1)
    })

  // Renderer process builder by vite (esBuild)
  build(rendererOptions())
    .then(() => {
      results += `${doneLog} - RendererProcess build success` + '\n\n'
      multiTasks.success('renderer')
    })
    .catch((error) => {
      multiTasks.error('renderer')
      console.log(`\n  ${errorLog} - failed to build renderer process`)
      console.error(`\n${error}\n`)
      process.exit(1)
    })
}

// We need to clean all files before re-build, check switch case
if (process.env.BUILD_TARGET === 'clean') clean()
else if (process.env.BUILD_TARGET === 'web') buildWeb()
else init()
