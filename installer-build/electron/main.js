/**
 * SUPER GOAT ROYALTIES APP - Electron Main Process
 * Cross-platform desktop wrapper for the Next.js application
 */

const { 
  app, 
  BrowserWindow, 
  Menu, 
  Tray, 
  shell, 
  dialog,
  ipcMain,
  nativeTheme 
} = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Application constants
const APP_NAME = 'SUPER GOAT ROYALTIES APP';
const APP_VERSION = '1.0.0';
const PORT = process.env.PORT || 3000;

// Global references
let mainWindow = null;
let tray = null;
let serverProcess = null;
let isQuitting = false;

// Development mode check
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Resource paths
const getResourcePath = (...args) => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, ...args);
  }
  return path.join(__dirname, '..', 'resources', ...args);
};

const getIconPath = () => {
  const platform = process.platform;
  if (platform === 'win32') {
    return getResourcePath('icon.ico');
  } else if (platform === 'darwin') {
    return getResourcePath('icon.icns');
  }
  return getResourcePath('icon.png');
};

/**
 * Create the main application window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    icon: getIconPath(),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    title: APP_NAME,
    backgroundColor: '#1a1a2e',
    show: false,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    frame: true
  });

  // Load the Next.js application
  const startUrl = `http://localhost:${PORT}`;
  
  // Try to load the app, with retry logic
  const loadApp = (retries = 10) => {
    mainWindow.loadURL(startUrl)
      .catch(() => {
        if (retries > 0) {
          console.log(`Retrying connection... (${retries} attempts left)`);
          setTimeout(() => loadApp(retries - 1), 1000);
        } else {
          dialog.showErrorBox(
            'Connection Error',
            `Failed to connect to the application server at ${startUrl}. Please restart the app.`
          );
        }
      });
  };

  // Wait a bit for server to start, then load
  setTimeout(() => loadApp(), 2000);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://localhost') || url.startsWith('https://localhost')) {
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Handle navigation
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(`http://localhost:${PORT}`)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // Handle window close
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      
      // On macOS, hide instead of quit
      if (process.platform === 'darwin') {
        mainWindow.hide();
      } else {
        // On Windows/Linux, minimize to tray
        mainWindow.hide();
        if (tray) {
          tray.displayBalloon && tray.displayBalloon({
            icon: getIconPath(),
            title: APP_NAME,
            content: 'Application is running in the background'
          });
        }
      }
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Create system tray icon
 */
function createTray() {
  tray = new Tray(getIconPath());
  
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Open Dashboard', 
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Open in Browser',
      click: () => shell.openExternal(`http://localhost:${PORT}`)
    },
    { type: 'separator' },
    { 
      label: 'Restart Server',
      click: () => {
        stopServer();
        startServer();
      }
    },
    { type: 'separator' },
    { 
      label: 'Quit', 
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip(APP_NAME);
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.focus();
      } else {
        mainWindow.show();
      }
    }
  });
}

/**
 * Start the Next.js server
 */
async function startServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting Next.js server...');
    
    const serverPath = app.isPackaged 
      ? path.join(process.resourcesPath, 'app', 'server.js')
      : path.join(__dirname, '..', '..', 'server.js');

    // Check if server.js exists
    if (!fs.existsSync(serverPath)) {
      console.error('Server file not found:', serverPath);
      reject(new Error('Server file not found'));
      return;
    }

    serverProcess = spawn('node', [serverPath], {
      cwd: path.dirname(serverPath),
      env: {
        ...process.env,
        PORT: PORT.toString(),
        NODE_ENV: 'production'
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    serverProcess.stdout.on('data', (data) => {
      console.log(`[Server] ${data.toString()}`);
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`[Server Error] ${data.toString()}`);
    });

    serverProcess.on('error', (error) => {
      console.error('Failed to start server:', error);
      reject(error);
    });

    serverProcess.on('exit', (code) => {
      console.log(`Server exited with code ${code}`);
      serverProcess = null;
    });

    // Give server time to start
    setTimeout(() => resolve(), 3000);
  });
}

/**
 * Stop the Next.js server
 */
function stopServer() {
  if (serverProcess) {
    console.log('Stopping server...');
    serverProcess.kill('SIGTERM');
    serverProcess = null;
  }
}

/**
 * Create application menu
 */
function createMenu() {
  const template = [
    // App menu (macOS)
    ...(process.platform === 'darwin' ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    
    // File menu
    {
      label: 'File',
      submenu: [
        {
          label: 'Reload Dashboard',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow?.reload()
        },
        { type: 'separator' },
        process.platform === 'darwin' 
          ? { role: 'close' }
          : { role: 'quit' }
      ]
    },
    
    // Edit menu
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    
    // View menu
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    
    // Window menu
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(process.platform === 'darwin' ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },
    
    // Help menu
    {
      role: 'help',
      submenu: [
        {
          label: 'Documentation',
          click: async () => {
            await shell.openExternal('https://github.com/DJSPEEDYGA/GOAT-Royalty-App2');
          }
        },
        {
          label: 'Report Issue',
          click: async () => {
            await shell.openExternal('https://github.com/DJSPEEDYGA/GOAT-Royalty-App2/issues');
          }
        },
        { type: 'separator' },
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: `About ${APP_NAME}`,
              message: APP_NAME,
              detail: `Version: ${APP_VERSION}\n\nMusic Royalty Management Platform\n\nFeatures:\n• AI-Powered Content Creation\n• Self-Healing Infrastructure\n• 242 API Endpoints\n• 6 AI Engines\n• Voice Commands\n• Real-time Dashboard\n\nCopyright © 2024 GOAT Royalties`
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// ============================================
// App Lifecycle Events
// ============================================

// App is ready
app.whenReady().then(async () => {
  try {
    // Start the Next.js server
    await startServer();
    
    // Create menu
    createMenu();
    
    // Create window
    createWindow();
    
    // Create tray icon
    createTray();
    
    // macOS: recreate window when clicking dock icon
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
    
    console.log(`${APP_NAME} v${APP_VERSION} started successfully`);
    
  } catch (error) {
    console.error('Failed to start application:', error);
    dialog.showErrorBox('Startup Error', `Failed to start: ${error.message}`);
    app.quit();
  }
});

// All windows closed
app.on('window-all-closed', () => {
  // On macOS, apps stay active until Cmd+Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Before quit
app.on('before-quit', () => {
  isQuitting = true;
  stopServer();
});

// App is about to quit
app.on('will-quit', () => {
  stopServer();
  if (tray) {
    tray.destroy();
  }
});

// Handle certificate errors (for development)
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  if (isDev) {
    event.preventDefault();
    callback(true);
  } else {
    callback(false);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  dialog.showErrorBox('Error', `An unexpected error occurred: ${error.message}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// ============================================
// IPC Handlers
// ============================================

ipcMain.handle('get-app-info', () => ({
  name: APP_NAME,
  version: APP_VERSION,
  platform: process.platform,
  port: PORT
}));

ipcMain.handle('open-external', async (event, url) => {
  await shell.openExternal(url);
});

ipcMain.handle('show-item-in-folder', (event, path) => {
  shell.showItemInFolder(path);
});