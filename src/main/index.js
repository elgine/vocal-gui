const { app, BrowserWindow, Menu } = require('electron');
const { isDev } = require('../../build/util');
const config = require('../../build/config');

let win;

const createWindow = () => {
    Menu.setApplicationMenu(null);
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            defaultFontFamily: {
                standard: 'Roboto',
                // serif:"",
                // sansSerif:"",
                // monospace:"",
            },
            defaultFontSize: 16,
            // defaultFixedFontSize:20,
            // minimumFontSize:0,
            defaultEncoding: 'utf-8',
            nodeIntegration: true
        }
    });

    if (isDev) {
        win.loadURL(`http://localhost:${config.devServer.port}/index.html`);
    } else {
        win.loadFile('index.html');
    }

    win.webContents.openDevTools();

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