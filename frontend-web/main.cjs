const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "HeLeP - Panel Administration",
    webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    },
});

  // Ouvre automatiquement l'inspecteur pour voir les erreurs React s'il y en a
    win.webContents.openDevTools();

    if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});