const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const path = require('path')
const prompts = require('prompts')
const { green, cyan, blue, red } = require('kolorist')

const {
  copy,
  emptyDir,
  isEmpty,
  isValidPackageName,
  toValidPackageName,
} = require('./utils')

const cwd = process.cwd()

const OPTIONS = [
  {
    name: 'vue',
    color: green,
    variants: [
      {
        name: 'vue-ts',
        display: 'TypeScript',
        color: blue,
      },
    ],
  },
  {
    name: 'react',
    color: cyan,
    variants: [
      {
        name: 'react-ts',
        display: 'TypeScript',
        color: blue,
      },
    ],
  },
]

const TEMPLATES = OPTIONS.map((option) => {
  return (
    (option.variants && option.variants.map((variant) => variant.name)) || [
      option.name,
    ]
  )
}).reduce((a, b) => a.concat(b), [])

const renameFiles = {
  _gitignore: '.gitignore',
}

async function init() {
  let targetDir = argv._[0]
  let template = argv.template || argv.t

  const defaultProjectName = !targetDir ? 'ev-project' : targetDir

  let result = {}

  try {
    result = await prompts(
      [
        {
          type: targetDir ? null : 'text',
          name: 'projectName',
          message: 'Project name:',
          initial: defaultProjectName,
          onState: (state) =>
            (targetDir = state.value.trim() || defaultProjectName),
        },
        {
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
          name: 'overwrite',
          message: () =>
            (targetDir === '.'
              ? 'Current directory'
              : `Target directory "${targetDir}"`) +
            ` is not empty. Remove existing files and continue?`,
        },
        {
          type: (_, { overwrite } = {}) => {
            if (overwrite === false) {
              throw new Error(red('✖') + ' Operation cancelled')
            }
            return null
          },
          name: 'overwriteChecker',
        },
        {
          type: () => (isValidPackageName(targetDir) ? null : 'text'),
          name: 'packageName',
          message: 'Package name:',
          initial: () => toValidPackageName(targetDir),
          validate: (dir) =>
            isValidPackageName(dir) || 'Invalid package.json name',
        },
        {
          type: template && TEMPLATES.includes(template) ? null : 'select',
          name: 'framework',
          message:
            typeof template === 'string' && !TEMPLATES.includes(template)
              ? `"${template}" isn't a valid template. Please choose from below: `
              : 'Select a framework for renderer process:',
          initial: 0,
          choices: OPTIONS.map((option) => {
            const optionColor = option.color
            return {
              title: optionColor(option.name),
              value: option,
            }
          }),
        },
        {
          type: (option) => (option && option.variants ? 'select' : null),
          name: 'variant',
          message: 'Select a variant:',
          choices: (option) =>
            option.variants.map((variant) => {
              const variantColor = variant.color
              return {
                title: variantColor(variant.name),
                value: variant.name,
              }
            }),
        },
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled')
        },
      }
    )
  } catch (cancelled) {
    console.log(cancelled.message)
    return
  }

  // user choice associated with prompts
  const { framework, overwrite, packageName, variant } = result

  const root = path.join(cwd, targetDir)

  if (overwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  // determine template
  template = variant || framework || template

  console.log(`\n🍉 Scaffolding project in ${root}...`)

  const templateDir = path.join(__dirname, `templates/template-${template}`)

  // Write file and special files to target directory
  const write = (file, content) => {
    const targetPath = renameFiles[file]
      ? path.join(root, renameFiles[file])
      : path.join(root, file)

    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(templateDir, file), targetPath)
    }
  }

  // get all files from template target folder
  const files = fs.readdirSync(templateDir)

  // copy every file to target directory =))) so stuck here for a long time, 2 hours for me :((
  for (const file of files.filter((f) => f !== 'package.json')) {
    write(file)
  }

  // we remove package.json, because we need customize props value by user's value
  const pkg = require(path.join(templateDir, `package.json`))

  pkg.name = packageName || targetDir

  // overwrite package.json file
  write('package.json', JSON.stringify(pkg, null, 2))

  // detect user use npm or yarn
  const pkgManager = /yarn/.test(process.env.npm_execpath) ? 'yarn' : 'npm'

  console.log(`\n✅ Done. Now, you can run:\n`)

  if (root !== cwd) {
    console.log(`  cd ${path.relative(cwd, root)}`)
  }
  console.log(`  ${pkgManager === 'yarn' ? `yarn` : `npm install`}`)
  console.log(`  ${pkgManager === 'yarn' ? `yarn dev` : `npm run dev`}`)
  console.log()
}

init().catch((error) => console.log(error))
