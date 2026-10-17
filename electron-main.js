const { app, BrowserWindow } = require('electron');
const path = require('path');

// Unlock Chromium Hardware Decoders for HEVC (H.265), Dolby AC3/EAC3, VAAPI & GPU Acceleration
app.commandLine.appendSwitch('enable-features', 'PlatformHEVCDecoderSupport,VaapiVideoDecoder,PlatformEncryptedDolbyVision');
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

function createWindow() {
  const win = new BrowserWindow({
    width: 1360,
    height: 820,
    minWidth: 380,
    minHeight: 560,
    title: 'Aurora Music & Video Player',
    icon: path.join(__dirname, 'icon-512.png'),
    backgroundColor: '#28311C',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
