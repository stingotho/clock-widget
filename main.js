console.log('Versions:', process.versions);
const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
console.log('Electron require:', require('electron'));
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 300,
        height: 300,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        skipTaskbar: true
    });

    mainWindow.loadFile('index.html');

    // mainWindow.webContents.openDevTools({ mode: 'detach' });
}

function createTray() {
    tray = new Tray(path.join(__dirname, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show/Hide', click: () => {
                if (mainWindow.isVisible()) {
                    mainWindow.hide();
                } else {
                    mainWindow.show();
                }
            }
        },
        {
            label: 'Quit', click: () => {
                app.isQuitting = true;
                app.quit();
            }
        }
    ]);
    tray.setToolTip('Clock Widget');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        }
    });
}

app.whenReady().then(() => {
    createWindow();
    createTray();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

let settingsWindow;

function createSettingsWindow() {
    if (settingsWindow) {
        settingsWindow.focus();
        return;
    }

    settingsWindow = new BrowserWindow({
        width: 300,
        height: 500,
        title: 'Settings',
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    settingsWindow.loadFile('settings.html');

    settingsWindow.on('closed', () => {
        settingsWindow = null;
    });
}

ipcMain.on('open-settings', () => {
    createSettingsWindow();
});

ipcMain.on('update-settings', (event, settings) => {
    if (mainWindow) {
        mainWindow.webContents.send('apply-settings', settings);
        mainWindow.setAlwaysOnTop(settings.alwaysOnTop);
    }
});

ipcMain.on('quit-app', () => {
    app.isQuitting = true;
    app.quit();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
