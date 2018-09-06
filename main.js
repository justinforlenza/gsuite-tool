const Splashscreen = require('@trodi/electron-splashscreen')
const {app, BrowserWindow} = require('electron')
const path = require('path')


let window

function createWindow () {
    const windowOptions = {
        width: 800,
        height: 600,
        show: false,
        resizable: false
    }

    window = Splashscreen.initSplashScreen({
        windowOpts: windowOptions,
        templateUrl: path.join(__dirname, '/assets/splash.svg'),
        delay: 0,
        minVisible: 1500,
        splashScreenOpts: {
            height: 500,
            width: 500,
            transparent: true,
        },
    })

    window.loadURL(`file://${path.join(__dirname, '/views/index.html')}`)

    window.webContents.openDevTools()

    // Emitted when the window is closed.
}


app.on('ready', createWindow)


app.on('window-all-closed', () => {
    app.quit()
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})
