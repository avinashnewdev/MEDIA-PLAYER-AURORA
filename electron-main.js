const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('enable-features', 'PlatformHEVCDecoderSupport,VaapiVideoDecoder');
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

// Register custom protocol before app is ready to fix file loading & CORS issues
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true } }
]);

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
      webSecurity: false
    }
  });

  // Load via custom secure app protocol
  win.loadURL('app://index.html');
}

app.whenReady().then(() => {
  protocol.handle('app', (request) => {
    let filePath = request.url.slice('app://'.length);
    if (filePath === '' || filePath === '/') filePath = 'index.html';
    return protocol.net.fetch('file://' + path.join(__dirname, filePath));
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
