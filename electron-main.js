const { app, BrowserWindow } = require('electron');
const path = require('path');

// Keep Chromium's media features enabled where the platform supports them.
app.commandLine.appendSwitch('enable-features', 'PlatformHEVCDecoderSupport,VaapiVideoDecoder');
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

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
      // Keep webSecurity enabled; local media should be handled explicitly.
      webSecurity: true
    }
  });

  // index.html is the actual entry point tracked in this repository.
  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
