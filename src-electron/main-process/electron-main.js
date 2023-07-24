import { app, BrowserWindow, nativeTheme } from 'electron'
import path from 'path'

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow

async function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    minHeight: 850,
    minWidth: 1050,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      // nodeIntegration: false,
      nodeIntegration: true,
      contextIsolation: true,
      // nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: false,
      enableRemoteModule: true,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })

  mainWindow.loadURL(process.env.APP_URL)
  mainWindow.setMenuBarVisibility(false)
  const contents = mainWindow.webContents
  console.log(contents)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // await webContents.getPrintersAsync()
}

app.on('ready', () => {
  createWindow()
  mainWindow.maximize()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
