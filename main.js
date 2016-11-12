'use strict';

const electron = require('electron')
const index    = require('./build/index')

const app           = electron.app
const BrowserWindow = electron.BrowserWindow
let mainWindow      = null

app.on('window-all-closed', () => {
  app.quit()
})

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        resizeable: false,
        webPreferences: {
          devTools: true
        }
    });
    mainWindow.webContents.openDevTools()
    mainWindow.loadURL(`file://${__dirname}/views/index.html`);
});

module.exports = index