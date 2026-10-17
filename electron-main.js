const { app, BrowserWindow } = require('electron');
const path = require('path');

// Unlock Chromium Hardware Decoders & Allow Local File Access
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
      webSecurity: false // Crucial for local file blobs & web audio nodes in .exe
    }
  });

  win.loadFile(path.join(__dirname, 'index_2.html'));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
