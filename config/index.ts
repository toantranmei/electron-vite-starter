import prodEnv from './prod.env'
import devEnv from './dev.env'

export default {
  build: {
    DisableDevModeFromKeyboard: true,
    env: prodEnv,
    hotPublishUrl: '',
    hotPublishConfigName: '',
  },
  dev: {
    env: devEnv,
    removeElectronJunk: true,
    port: 1004,
  },
  IsUseSysTitle: true,
  BuiltInServerPort: 100421,
  UseStartupChart: true,
}
