export default {
  build: {
    DisableDevModeFromKeyboard: true,
    env: require('./prod.env'),
    hotPublishUrl: '',
    hotPublishConfigName: '',
  },
  dev: {
    env: require('./dev.env'),
    removeElectronJunk: true,
    port: 9080,
  },
  IsUseSysTitle: true,
  BuiltInServerPort: 100421,
  UseStartupChart: true,
}
