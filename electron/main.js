'use strict'

const { app, BrowserWindow, dialog } =  require('electron');
const yaml = require('js-yaml');
const fs = require('fs');
const { autoUpdater } = require("electron-updater");

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
global.config = {};

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({ width: 800, height: 600, frame: false, fullscreen: true, webPreferences: {
            nodeIntegration: false, contextIsolation: true
        } });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        // Load the index.html when not in development
        win.loadURL(global.config.api + global.config.room)
    }

    win.on('closed', () => {
        win = null
    })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
        win.maximize();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    loadConfig();
    createWindow();
    win.maximize();

    setInterval(() => {
        autoUpdater.checkForUpdates()
    }, 30000)
});

function loadConfig() {
    try {
        global.config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
    } catch (e) {
        const options = {
            type: "error",
            title: "Error while reading configuration file!",
            buttons: ["Quit"],
            message: "Tried to read " + app.getAppPath() + "/config.yml " +
                "and got " + e,
        };
        let response = dialog.showMessageBoxSync(options);
        if(response === 0)
            app.exit(1)
    }
}
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
})