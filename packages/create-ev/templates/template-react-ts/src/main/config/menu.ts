/**
 * Here is the place to define the menu, please check for details
 * Link: https://electronjs.org/docs/api/menu
 */

import { dialog } from 'electron'
import { type, arch, release } from 'os'
import packageInfo from '../../../package.json'

function info() {
  dialog.showMessageBox({
    title: 'Info',
    type: 'info',
    message: 'Electron + Vite + React',
    detail: `Version Info: ${packageInfo.version}\nEngine Version：${
      process.versions.v8
    }\nCurrent System：${type()} ${arch()} ${release()}`,
    noLink: true,
    buttons: ['View on Github'],
  })
}

const menu = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'F5',
        role: 'reload',
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+F4',
        role: 'close',
      },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About',
        click: function () {
          info()
        },
      },
    ],
  },
]

export default menu
