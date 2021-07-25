import { app, BrowserWindow, Menu, dialog } from 'electron'

import config from '../../../config/index'
import menuConfig from '../config/menu'
import { winURL, loadingURL } from '../config/static'

class MainInit {
  public winURL: string = ''
  public preloadURL: string = ''
  public loadWindow: BrowserWindow = null
  public mainWindow: BrowserWindow = null

  constructor() {
    this.winURL = winURL
    this.preloadURL = loadingURL
    if (process.env.NODE_ENV === 'development') {
      menuConfig.push({
        label: 'Developer',
        submenu: [
          {
            label: 'Open Devtools',
            accelerator: 'Cmd/Ctrl + I',
            role: 'toggleDevtools',
          },
        ],
      })
    }
  }
  // Main window function
  createMainWindow() {
    this.mainWindow = new BrowserWindow({
      height: 800,
      useContentSize: true,
      width: 1700,
      minWidth: 1366,
      show: false,
      frame: config.IsUseSysTitle,
      titleBarStyle: 'hidden',
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
        webSecurity: false,
        // If env is development, u can use devtools
        devTools: process.env.NODE_ENV === 'development',
        // Enable eraser animation in macos
        scrollBounce: process.platform === 'darwin',
      },
    })
    // Setup a menu's template
    const menu = Menu.buildFromTemplate(menuConfig as any)

    // Load menu's template
    Menu.setApplicationMenu(menu)

    // Load main window
    this.mainWindow.loadURL(this.winURL)

    // TODO: Check update, if have a new version, auto download update file

    // TODO: Electron Update Registration

    // TODO: Enable the protocol, here it is only used when customizing the header bar

    // Display view after dom ready
    this.mainWindow.webContents.once('dom-ready', () => {
      this.mainWindow.show()
      if (config.UseStartupChart) this.loadWindow.destroy()
    })

    // Automatically start devtools in development mode
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.webContents.openDevTools({
        mode: 'undocked',
        activate: true,
      })
    }

    // If rendering process is stuck
    app.on('render-process-gone', (event, webContents, details) => {
      const message = {
        title: '',
        buttons: [],
        message: '',
      }

      switch (details.reason) {
        case 'crashed':
          message.title = 'Error'
          message.buttons = ['Restart', 'Force Quit']
          message.message =
            'The graphical process crashes, whether to perform a soft restart operation?'
          break
        case 'killed':
          message.title = 'Error'
          message.buttons = ['Restart', 'Force Quit']
          message.message =
            'The graphical process is terminated due to unknown reasons. Do you want to perform a soft restart operation?'
          break
        case 'oom':
          message.title = 'Error'
          message.buttons = ['Restart', 'Force Quit']
          message.message =
            'Insufficient memory, does a soft restart release the memory?'
          break

        default:
          break
      }

      dialog
        .showMessageBox(this.mainWindow, {
          type: 'warning',
          title: message.title,
          buttons: message.buttons,
          message: message.message,
          noLink: true,
        })
        .then((res) => {
          if (res.response === 0) this.mainWindow.reload()
          else this.mainWindow.close()
        })
    })

    // HELP! I don’t know why, anyway, the page in this window is executed when the suspended animation is triggered.
    this.mainWindow.on('unresponsive', () => {
      dialog
        .showMessageBox(this.mainWindow, {
          type: 'warning',
          title: 'Error',
          buttons: ['Restart', 'Force Quit'],
          message:
            'The graphical process is unresponsive, do you wait for it to recover?',
          noLink: true,
        })
        .then((res) => {
          if (res.response === 0) this.mainWindow.reload()
          else this.mainWindow.close()
        })
    })

    /**
     * New gpu crash detection, see detailed parameters：
     * Link: http://www.electronjs.org/docs/api/app
     */
    app.on('child-process-gone', (event, details) => {
      const message = {
        title: '',
        buttons: [],
        message: '',
      }
      switch (details.type) {
        case 'GPU':
          switch (details.reason) {
            case 'crashed':
              message.title = 'Error'
              message.buttons = ['Turn off', 'Close']
              message.message =
                'The hardware acceleration process has crashed. Do you want to turn off hardware acceleration and restart?'
              break
            case 'killed':
              message.title = 'Error'
              message.buttons = ['Turn off', 'Close']
              message.message =
                'The hardware acceleration process was terminated unexpectedly. Do you want to turn off the hardware acceleration and restart it?'
              break
            default:
              break
          }
          break

        default:
          break
      }
      dialog
        .showMessageBox(this.mainWindow, {
          type: 'warning',
          title: message.title,
          buttons: message.buttons,
          message: message.message,
          noLink: true,
        })
        .then((res) => {
          // Use this setting to disable the graphics acceleration mode when the graphics card crashes.
          if (res.response === 0) {
            if (details.type === 'GPU') app.disableHardwareAcceleration()
            this.mainWindow.reload()
          } else {
            this.mainWindow.close()
          }
        })
    })

    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })
  }

  /**
   * Load window function, Maybe everyone will need it, because i play game, desktop all good ux which have loading window =))
   * HELP: If u have more idea pull and contribute <3
   */
  loadingWindow(loadingURL: string) {
    this.loadWindow = new BrowserWindow({
      width: 600,
      height: 600,
      frame: false,
      skipTaskbar: true,
      transparent: true,
      resizable: false,
      webPreferences: { experimentalFeatures: true },
    })

    this.loadWindow.loadURL(loadingURL)
    this.loadWindow.show()
    this.loadWindow.setAlwaysOnTop(true)

    // The delay of two seconds can be adjusted later according to the situation,
    // I think u increase more time, maybe 7-8 seconds to use can easy more to decide quit app =))
    setTimeout(() => {
      this.createMainWindow()
    }, 3500)
  }

  // Initialize window function
  initWindow() {
    if (config.UseStartupChart) {
      return this.loadingWindow(this.preloadURL)
    } else {
      return this.createMainWindow()
    }
  }
}
export default MainInit
