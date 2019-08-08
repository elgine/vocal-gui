const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { isDev } = require('./build/util');
const config = require('./build/config');
const path = require('path');

let win;

const bindHandlers = () => {
    function sendMessage(type, payload) {
        if (win) {
            win.webContents.send('ELECTRON_ACTION', { type, payload });
        }
    }
    ipcMain.on('ELECTRON_ACTION', (e, arg) => {
        const { type, payload } = arg;
        switch (type) {
            case 'minimize':
                win && win.minimize();
                break;
            case 'maximizeOrRestore':
                if (win) {
                    if (win.isMaximized()) {
                        win.restore();
                    } else {
                        win.maximize();
                    }
                }
                break;
            case 'close':
                win && win.close();
                break;
        }
    });
    win.webContents.send('ELECTRON_ACTION', { type: 'initialize' });
    win.on('minimize', () => sendMessage('window/ACTION_WINDOW_STATE_CHANGE', 'minimize'));
    win.on('maximize', () => sendMessage('window/ACTION_WINDOW_STATE_CHANGE', 'maximize'));
    win.on('restore', () => sendMessage('window/ACTION_WINDOW_STATE_CHANGE', 'normal'));
    win.on('closed', () => {
        win = null;
    });
};

const createWindow = () => {
    Menu.setApplicationMenu(null);
    win = new BrowserWindow({
        minWidth: 640,
        minHeight: 480,
        width: 800,
        height: 600,
        frame: false,
        backgroundColor: '#121212',
        icon: isDev() ? path.resolve(__dirname, './static/logo/favicon.png') : './renderer/logo/favicon.png',
        webPreferences: {
            defaultFontFamily: {
                standard: 'Roboto'
            },
            defaultFontSize: 16,
            defaultEncoding: 'utf-8',
            nodeIntegration: true
        }
    });
    if (isDev()) {
        win.loadURL(`http://localhost:${config.devServer.port}/index.html`);
        win.webContents.openDevTools();
    } else {
        win.loadFile('./renderer/index.html');
    }
    win.webContents.on('did-finish-load', bindHandlers);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});