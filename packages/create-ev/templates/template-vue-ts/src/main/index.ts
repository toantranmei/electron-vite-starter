'use strict'

import { app } from 'electron'
// import electronDevtoolsInstaller, {
//   VUEJS_DEVTOOLS,
// } from 'electron-devtools-installer'

import InitWindow from './services/windowManager'
import { disableDevModeFromKeyboard } from './config/disable'

function onAppReady() {
  new InitWindow().initWindow()
  disableDevModeFromKeyboard()
  // TODO: turn on dev tools, but have a trouble install vue devtools, so i comment again, this is a feature
  // if (process.env.NODE_ENV === 'development') {
  //   electronDevtoolsInstaller(VUEJS_DEVTOOLS)
  //     .then((name) => console.log(`Installed: ${name}`))
  //     .catch((err) => console.log('Unable to install `vue-devtools`: \n', err))
  // }
}

app.isReady() ? onAppReady() : app.on('ready', onAppReady)

// Due to the 9.x version issue, you need to add this configuration to close the cross-domain issue
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')

app.on('window-all-closed', () => {
  // All platforms exit the software when all windows are closed
  app.quit()
})
app.on('browser-window-created', () => {
  console.log('Window Created')
})

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.removeAsDefaultProtocolClient('electron-vue-template')
    console.log(
      'Cannot be used in the development environment due to the particularity of the framework'
    )
  }
} else {
  app.setAsDefaultProtocolClient('electron-vue-template')
}
