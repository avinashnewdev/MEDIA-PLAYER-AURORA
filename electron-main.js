const { app, BrowserWindow } = require('electron');
const path = require('path');

// Keep Chromium's normal security protections enabled. Media files selected
// by the user can still be opened through the file picker without disabling
// web security for the entire renderer.
app.commandLine.appendSwitch('enable-gpu-rasterization');

function createWindow() {
  const win = new BrowserWindow({
    width: 1360,
    height: 820,
    minWidth: 400,
    minHeight: 600,
    title: 'Aurora Media Player',
    icon: path.join(__dirname, 'icon-512.png'),
    backgroundColor: '#0A0B10',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
