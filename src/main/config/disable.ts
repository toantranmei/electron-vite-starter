import { globalShortcut } from 'electron'
import config from '../../../config/index'

export const disableDevModeFromKeyboard = () => {
  if (
    process.env.NODE_ENV === 'production' &&
    config.build.DisableDevModeFromKeyboard
  ) {
    globalShortcut.register('f12', () => {
      console.log('Prevent user turn on console panel!')
    })
  }
}
