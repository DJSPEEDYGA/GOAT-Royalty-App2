const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let serverProcess;
const PORT = 3000;

// Function to start the Next.js server
function startNextServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting Next.js server...');
    
    const isDev = !app.isPackaged;
    
    if (isDev) {
      // In development, the user should run npm run dev separately
      console.log('Development mode - assuming server is already running');
      resolve();
      return;
    }
    
    // In production, start the server
    const appPath = app.getAppPath();
    const nextPath = path.join(appPath, 'node_modules', 'next', 'dist', 'bin', 'next');
    
    console.log('App path:', appPath);
    console.log('Next path:', nextPath);
    
    serverProcess = spawn('node', [nextPath, 'start'], {
      cwd: appPath,
      env: { ...process.env, PORT: PORT.toString() },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    serverProcess.stdout.on('data', (data) => {
      console.log(`Server stdout: ${data}`);
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error(`Server stderr: ${data}`);
    });
    
    serverProcess.on('error', (err) => {
      console.error('Failed to start server:', err);
      reject(err);
    });
    
    // Give the server time to start
    setTimeout(resolve, 2000);
  });
}

// Simple function to check if server is responding
function waitForServer(maxAttempts = 60) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const checkServer = () => {
      attempts++;
      console.log(`Checking server... attempt ${attempts}/${maxAttempts}`);
      
      const req = http.get(`http://localhost:${PORT}`, (res) => {
        console.log('Server is ready!');
        resolve();
      });
      
      req.on('error', (err) => {
        if (attempts >= maxAttempts) {
          console.error('Server failed to start after', maxAttempts, 'attempts');
          reject(new Error('Server timeout'));
        } else {
          // Try again in 1 second
          setTimeout(checkServer, 1000);
        }
      });
      
      req.setTimeout(1000, () => {
        req.destroy();
      });
    };
    
    checkServer();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'public', 'icon.png'),
    show: false,
    backgroundColor: '#0A0A0A',
    title: 'GOAT Royalty App'
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.loadURL(`http://localhost:${PORT}`);

  // Open DevTools in development
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Handle navigation
  mainWindow.webContents.on('will-navigate', (event, url) => {
    // Allow internal navigation
    if (url.startsWith('http://localhost')) {
      return;
    }
    // Open external links in default browser
    event.preventDefault();
    require('electron').shell.openExternal(url);
  });

  // Reload on fail
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
    setTimeout(() => {
      if (mainWindow) {
        mainWindow.loadURL(`http://localhost:${PORT}`);
      }
    }, 2000);
  });
}

app.whenReady().then(async () => {
  console.log('GOAT Royalty App starting...');
  console.log('App is packaged:', app.isPackaged);
  console.log('App path:', app.getAppPath());
  
  try {
    // Start the Next.js server if packaged
    if (app.isPackaged) {
      await startNextServer();
    }
    
    console.log('Waiting for Next.js server on port', PORT);
    await waitForServer();
    console.log('Creating window...');
    createWindow();
  } catch (error) {
    console.error('Failed to connect to server:', error);
    
    // Show error dialog
    dialog.showErrorBox(
      'Server Error',
      'Could not connect to the application server.\n\n' +
      'Please make sure:\n' +
      '1. Port 3000 is not in use by another application\n' +
      '2. You have run "npm run dev" in a separate terminal\n\n' +
      'For packaged app: The server should start automatically.\n' +
      'If this error persists, please contact support.'
    );
    
    app.quit();
  }

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});