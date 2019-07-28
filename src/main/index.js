const { app, BrowserWindow } = require('electron');
const { isDev } = require('../../build/util');
const config = require('../../build/config');

let win;

const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    if (isDev) {
        win.loadURL(`http://localhost:${config.devServer.port}/index.html`);
    } else {
        win.loadFile('index.html');
    }

    win.on('closed', () => {
        win = null;
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});