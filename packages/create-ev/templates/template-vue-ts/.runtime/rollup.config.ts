import path from 'path'
import { RollupWatchOptions } from 'rollup'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import esBuild, { Options } from 'rollup-plugin-esbuild'
import json from '@rollup/plugin-json'
import {
  nodeResolve,
  RollupNodeResolveOptions,
} from '@rollup/plugin-node-resolve'
// import obfuscator from 'rollup-plugin-obfuscator'
import typescript from 'rollup-plugin-typescript2'

const typescriptTransformOptions = {
  typescript: require('typescript'),
  tsconfigDefaults: {
    compilerOptions: {
      plugins: [
        { transform: 'typescript-transform-paths' },
        {
          transform: 'typescript-transform-paths',
          afterDeclarations: true,
        },
      ],
    },
  },
}

// set hypothetical file url
const aliasOptions = {
  resolve: ['js', 'ts'],
  entries: [
    { find: '@main', replacement: path.join(__dirname, '../src/main') },
    { find: '@config', replacement: path.join(__dirname, '../config') },
  ],
}

// Surely, we esBuild, one more because vite use esBuild so i install it and make it =)))
const esBuildOptions: Options = {
  define: {
    __VERSION__: '"x.y.z"',
  },
  exclude: /node_modules/, // default
  include: /\.[jt]sx?$/, // default, inferred from `loaders` option
  minify: process.env.NODE_ENV === 'production',
  loaders: {
    // extra loaders config
    // Add .json files support
    '.json': 'json', // require @rollup/plugin-commonjs
    // Enable JSX in .js files too
    '.js': 'jsx',
  },
  sourceMap: false, // default
  target: 'es2017', // default, or 'es20XX', 'esnext'
  // watch: process.argv.includes('--watch'), // rollup config, if u need watch
}

// Eliminate warnings nodejs modules. Ex: path, http
const nodeResolveOptions: RollupNodeResolveOptions = {
  preferBuiltins: true,
  browser: true,
}

// If u want obfuscator code after build. Here for u: https://github.com/getkey/rollup-plugin-obfuscator
// const obfuscatorOptions = {}

export default (env = 'production'): RollupWatchOptions => {
  return {
    input: path.join(__dirname, '../src/main/index.ts'),
    output: {
      file: path.join(__dirname, '../dist/electron/main/main.js'),
      format: 'cjs', // commonjs format
      name: 'MainProcess',
      sourcemap: false,
    },
    plugins: [
      typescript(typescriptTransformOptions),
      nodeResolve(nodeResolveOptions),
      commonjs({
        sourceMap: false,
      }),
      json(),
      esBuild(esBuildOptions),
      // obfuscator(obfuscatorOptions),
      alias(aliasOptions),
    ],
    external: [
      'crypto',
      'assert',
      'fs',
      'util',
      'glob',
      'os',
      'events',
      'child_process',
      'http',
      'https',
      'path',
      'electron',
      'express',
      'ffi-napi',
      'ref-napi',
      'ref-struct-napi',
    ],
  }
}
