import { join } from 'path'
import { UserConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

import configDefault from '../config'

// Case build on web
const isTargetBuildForWeb = process.env.BUILD_TARGET === 'web'

// I'm so lazy using other package, so make here :((
function resolve(dir: string): string {
  return join(__dirname, '..', dir)
}

const root = resolve('src/renderer')

export default (): UserConfig => {
  return {
    mode: process.env.NODE_ENV,
    root,
    define: {
      'process.env':
        process.env.NODE_ENV === 'production'
          ? configDefault.build.env
          : configDefault.dev.env,
      'process.env.IS_WEB': isTargetBuildForWeb,
      'process.env.PORT': configDefault.dev.port,
    },
    resolve: {
      alias: {
        '@renderer': root,
      },
    },
    base: './',
    build: {
      outDir: isTargetBuildForWeb
        ? resolve('dist/web')
        : resolve('dist/electron/renderer'),
      emptyOutDir: true,
    },
    server: {
      port: Number(process.env.PORT),
    },
    plugins: [reactRefresh()],
    optimizeDeps: {},
    publicDir: resolve('static'),
  }
}
