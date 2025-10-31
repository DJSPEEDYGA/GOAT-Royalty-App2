const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let nextServer;
const PORT = 3000;

// Check if Next.js server is already running
function checkServerRunning() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${PORT}`, (res) => {
      resolve(true);
    });
    req.on('error', () => {
      resolve(false);
    });
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Start Next.js server
async function startNextServer() {
  // Check if server is already running
  const isRunning = await checkServerRunning();
  if (isRunning) {
    console.log('Next.js server already running on port', PORT);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    console.log('Starting Next.js server...');
    
    // Determine if we're in development or production
    const isDev = !app.isPackaged;
    
    if (isDev) {
      // Development mode - use npm run dev
      nextServer = spawn('npm', ['run', 'dev'], {
        cwd: __dirname,
        shell: true,
        stdio: 'pipe'
      });
    } else {
      // Production mode - use next start
      const nextPath = path.join(__dirname, 'node_modules', '.bin', 'next');
      nextServer = spawn(nextPath, ['start'], {
        cwd: __dirname,
        shell: true,
        stdio: 'pipe'
      });
    }

    nextServer.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('Next.js:', output);
      
      // Check if server is ready
      if (output.includes('Ready') || output.includes('started server') || output.includes('Local:')) {
        console.log('Next.js server is ready!');
        resolve();
      }
    });

    nextServer.stderr.on('data', (data) => {
      console.error('Next.js Error:', data.toString());
    });

    nextServer.on('error', (error) => {
      console.error('Failed to start Next.js server:', error);
      reject(error);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      console.log('Server startup timeout - proceeding anyway');
      resolve();
    }, 30000);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'public', 'icon.png'),
    show: false // Don't show until ready
  });

  // Show window when ready to avoid white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the Next.js app
  mainWindow.loadURL(`http://localhost:${PORT}`);

  // Open DevTools in development
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Handle navigation errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
    
    // Retry loading after a delay
    setTimeout(() => {
      if (mainWindow) {
        mainWindow.loadURL(`http://localhost:${PORT}`);
      }
    }, 2000);
  });
}

app.whenReady().then(async () => {
  console.log('Electron app ready, starting Next.js server...');
  
  try {
    await startNextServer();
    console.log('Creating window...');
    createWindow();
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  // Kill Next.js server when app closes
  if (nextServer) {
    console.log('Stopping Next.js server...');
    nextServer.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Ensure Next.js server is killed
  if (nextServer) {
    nextServer.kill();
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});