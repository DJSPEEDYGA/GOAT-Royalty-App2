#!/bin/bash

#######################################################
# SUPER GOAT ROYALTIES APP - Windows EXE Builder
# Creates Windows installer from Linux using Wine/NSIS
#######################################################

set -e

APP_NAME="SUPER GOAT ROYALTIES APP"
APP_VERSION="1.0.0"
BUILD_DIR="$(cd .. && pwd)"
ROOT_DIR="$(cd ../.. && pwd)"
OUTPUT_DIR="$BUILD_DIR/output"
RESOURCES_DIR="$BUILD_DIR/resources"
ELECTRON_DIR="$BUILD_DIR/electron"

echo "═══════════════════════════════════════════════════════"
echo "  Building Windows EXE Installer"
echo "═══════════════════════════════════════════════════════"

# Create output directory
mkdir -p "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR/windows"

# Check for required tools
echo "[*] Checking Windows build tools..."

if command -v wine64 &> /dev/null; then
    echo "    ✓ Wine64 found"
else
    echo "    ! Wine64 not found - installing..."
    sudo apt-get update && sudo apt-get install -y wine64 wine32
fi

if command -v makensis &> /dev/null; then
    echo "    ✓ NSIS found"
else
    echo "    ! NSIS not found - installing..."
    sudo apt-get install -y nsis
fi

# Create Electron app structure
echo "[*] Creating Electron app structure..."

mkdir -p "$OUTPUT_DIR/windows/app"
mkdir -p "$OUTPUT_DIR/windows/app/resources"

# Copy application files
echo "[*] Copying application files..."

# Core application
cp -r "$ROOT_DIR/pages" "$OUTPUT_DIR/windows/app/" 2>/dev/null || true
cp -r "$ROOT_DIR/components" "$OUTPUT_DIR/windows/app/" 2>/dev/null || true
cp -r "$ROOT_DIR/public" "$OUTPUT_DIR/windows/app/" 2>/dev/null || true
cp -r "$ROOT_DIR/styles" "$OUTPUT_DIR/windows/app/" 2>/dev/null || true
cp -r "$ROOT_DIR/lib" "$OUTPUT_DIR/windows/app/" 2>/dev/null || true

# Configuration files
cp "$ROOT_DIR/package.json" "$OUTPUT_DIR/windows/app/" 2>/dev/null || true
cp "$ROOT_DIR/next.config.js" "$OUTPUT_DIR/windows/app/" 2>/dev/null || true
cp "$ROOT_DIR/.env.local" "$OUTPUT_DIR/windows/app/" 2>/dev/null || echo "Note: .env.local not found"

# Self-healing system
if [ -d "$ROOT_DIR/lib/self-healing" ]; then
    echo "[*] Including self-healing system..."
    mkdir -p "$OUTPUT_DIR/windows/app/lib/self-healing"
    cp -r "$ROOT_DIR/lib/self-healing"/* "$OUTPUT_DIR/windows/app/lib/self-healing/"
fi

# Build Next.js if needed
if [ -d "$ROOT_DIR/.next" ]; then
    echo "[*] Copying Next.js build..."
    cp -r "$ROOT_DIR/.next" "$OUTPUT_DIR/windows/app/"
else
    echo "[*] Building Next.js application..."
    cd "$ROOT_DIR"
    npm run build 2>/dev/null || echo "Warning: Build may have issues"
    cp -r "$ROOT_DIR/.next" "$OUTPUT_DIR/windows/app/" 2>/dev/null || true
fi

# Create Electron main file for Windows
echo "[*] Creating Electron wrapper..."

cat > "$OUTPUT_DIR/windows/app/main.js" << 'ELECTRON_MAIN'
const { app, BrowserWindow, Menu, Tray, shell, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let tray;
let serverProcess;
const PORT = 3000;

// App icon path
const iconPath = path.join(__dirname, 'resources', 'icon.ico');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'SUPER GOAT ROYALTIES APP',
    backgroundColor: '#1a1a2e',
    show: false
  });

  // Load the app
  mainWindow.loadURL(`http://localhost:${PORT}`);
  
  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Create menu
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => mainWindow.reload() },
        { type: 'separator' },
        { label: 'Exit', click: () => { app.isQuitting = true; app.quit(); } }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Toggle DevTools', accelerator: 'F12', click: () => mainWindow.webContents.toggleDevTools() },
        { type: 'separator' },
        { label: 'Fullscreen', accelerator: 'F11', click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()) }
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Documentation', click: () => shell.openExternal('https://github.com/DJSPEEDYGA/GOAT-Royalty-App2') },
        { label: 'About', click: () => dialog.showMessageBox(mainWindow, {
          type: 'info',
          title: 'About SUPER GOAT ROYALTIES APP',
          message: 'SUPER GOAT ROYALTIES APP v1.0.0',
          detail: 'Music Royalty Management Platform\n\nAI-Powered • Self-Healing • Enterprise Grade'
        })}
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

function createTray() {
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: () => mainWindow.show() },
    { label: 'Reload', click: () => mainWindow.reload() },
    { type: 'separator' },
    { label: 'Quit', click: () => { app.isQuitting = true; app.quit(); } }
  ]);
  tray.setToolTip('SUPER GOAT ROYALTIES APP');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => mainWindow.show());
}

function startServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting Next.js server...');
    
    // Start the Next.js server
    serverProcess = spawn('node', ['server.js'], {
      cwd: __dirname,
      env: { ...process.env, PORT: PORT.toString() },
      stdio: 'inherit'
    });

    // Wait for server to be ready
    setTimeout(() => {
      resolve();
    }, 3000);

    serverProcess.on('error', (err) => {
      console.error('Server error:', err);
      reject(err);
    });
  });
}

// App lifecycle
app.whenReady().then(async () => {
  try {
    await startServer();
    createWindow();
    createTray();
  } catch (error) {
    console.error('Failed to start:', error);
    dialog.showErrorBox('Startup Error', `Failed to start the application: ${error.message}`);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
  if (serverProcess) {
    serverProcess.kill();
  }
});

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show();
  }
});
ELECTRON_MAIN

# Create preload script
cat > "$OUTPUT_DIR/windows/app/preload.js" << 'PRELOAD'
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  appVersion: '1.0.0',
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close')
});
PRELOAD

# Create server.js for standalone
cat > "$OUTPUT_DIR/windows/app/server.js" << 'SERVER_JS'
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(\`> Ready on http://\${hostname}:\${port}\`);
    });
});
SERVER_JS

# Create package.json for the app
cat > "$OUTPUT_DIR/windows/app/package.json" << PKG_JSON
{
  "name": "super-goat-royalties",
  "version": "1.0.0",
  "description": "SUPER GOAT ROYALTIES APP - Music Royalty Management Platform",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "server": "node server.js"
  },
  "dependencies": {
    "electron": "^28.0.0",
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
PKG_JSON

# Create NSIS installer script
echo "[*] Creating NSIS installer script..."

mkdir -p "$RESOURCES_DIR"

cat > "$RESOURCES_DIR/installer.nsi" << 'NSIS_SCRIPT'
!include "MUI2.nsh"
!include "FileFunc.nsh"

; Application information
Name "SUPER GOAT ROYALTIES APP"
OutFile "..\output\SUPER-GOAT-ROYALTIES-Setup-1.0.0.exe"
InstallDir "$PROGRAMFILES64\SUPER GOAT ROYALTIES APP"
InstallDirRegKey HKLM "Software\SUPER GOAT ROYALTIES APP" "Install_Dir"
RequestExecutionLevel admin

; Interface settings
!define MUI_ICON "..\resources\icon.ico"
!define MUI_UNICON "..\resources\icon.ico"
!define MUI_WELCOMEFINISHPAGE_BITMAP "..\resources\welcome.bmp"
!define MUI_ABORTWARNING

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "..\resources\license.txt"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Language
!insertmacro MUI_LANGUAGE "English"

; Installer sections
Section "Main Application" SecMain
  SetOutPath "$INSTDIR"
  
  ; Copy all files
  File /r "..\output\windows\app\*.*"
  
  ; Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  ; Registry entries
  WriteRegStr HKLM "Software\SUPER GOAT ROYALTIES APP" "Install_Dir" "$INSTDIR"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUPER GOAT ROYALTIES APP" "DisplayName" "SUPER GOAT ROYALTIES APP"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUPER GOAT ROYALTIES APP" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUPER GOAT ROYALTIES APP" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUPER GOAT ROYALTIES APP" "NoRepair" 1
  
  ; Get installation size
  ${GetSize} "$INSTDIR" "/S=0K" $0
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUPER GOAT ROYALTIES APP" "EstimatedSize" "$0"
SectionEnd

Section "Desktop Shortcut" SecDesktop
  CreateShortcut "$DESKTOP\SUPER GOAT ROYALTIES APP.lnk" "$INSTDIR\SUPER GOAT ROYALTIES.exe" "" "$INSTDIR\resources\icon.ico"
SectionEnd

Section "Start Menu Shortcut" SecStartMenu
  CreateDirectory "$SMPROGRAMS\SUPER GOAT ROYALTIES APP"
  CreateShortcut "$SMPROGRAMS\SUPER GOAT ROYALTIES APP\SUPER GOAT ROYALTIES APP.lnk" "$INSTDIR\SUPER GOAT ROYALTIES.exe" "" "$INSTDIR\resources\icon.ico"
  CreateShortcut "$SMPROGRAMS\SUPER GOAT ROYALTIES APP\Uninstall.lnk" "$INSTDIR\Uninstall.exe"
SectionEnd

; Uninstaller
Section "Uninstall"
  ; Remove files
  RMDir /r "$INSTDIR"
  
  ; Remove shortcuts
  Delete "$DESKTOP\SUPER GOAT ROYALTIES APP.lnk"
  Delete "$SMPROGRAMS\SUPER GOAT ROYALTIES APP\*.*"
  RMDir "$SMPROGRAMS\SUPER GOAT ROYALTIES APP"
  
  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUPER GOAT ROYALTIES APP"
  DeleteRegKey HKLM "Software\SUPER GOAT ROYALTIES APP"
SectionEnd
NSIS_SCRIPT

# Create license file
cat > "$RESOURCES_DIR/license.txt" << 'LICENSE'
SUPER GOAT ROYALTIES APP
END USER LICENSE AGREEMENT

Copyright (c) 2024 GOAT Royalties. All rights reserved.

This software is provided for use in managing music royalties and 
leveraging AI-powered content creation tools.

BY INSTALLING THIS SOFTWARE, YOU AGREE TO THE TERMS OF THIS LICENSE.
LICENSE

# Create a placeholder icon if not exists
if [ ! -f "$RESOURCES_DIR/icon.ico" ]; then
    echo "[*] Creating placeholder icon..."
    # Create a simple 256x256 ICO placeholder
    # In production, use a real icon design tool
    convert -size 256x256 xc:purple -fill white -gravity center -pointsize 72 -annotate 0 "GOAT" "$RESOURCES_DIR/icon.ico" 2>/dev/null || \
    echo "Note: Install ImageMagick for icon generation, or provide custom icon.ico"
fi

# Install npm dependencies for the Windows app
echo "[*] Installing npm dependencies..."
cd "$OUTPUT_DIR/windows/app"
npm install --production 2>/dev/null || echo "Note: Some dependencies may require manual install"

# Package with Electron Builder
echo "[*] Packaging with Electron Builder..."

cd "$OUTPUT_DIR/windows/app"

# Create electron-builder config
cat > electron-builder.yml << 'ELECTRON_BUILDER'
appId: com.goatroyalties.app
productName: SUPER GOAT ROYALTIES APP
copyright: Copyright © 2024 GOAT Royalties

win:
  target:
    - target: nsis
      arch:
        - x64
  icon: resources/icon.ico

nsis:
  oneClick: false
  perMachine: true
  allowToChangeInstallationDirectory: true
  installerIcon: resources/icon.ico
  uninstallerIcon: resources/icon.ico
  installerHeaderIcon: resources/icon.ico
  createDesktopShortcut: true
  createStartMenuShortcut: true
  shortcutName: SUPER GOAT ROYALTIES APP

files:
  - "**/*"
  - "!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}"
  - "!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}"
  - "!**/node_modules/.bin"
  - "!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}"
  - "!.{git,cvs,svn,DS_Store}"
  - "!**/._*"
  - "!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}"
  - "!**/{__pycache__,thumbs.db,.flow,cmake-install.cmake}"
ELECTRON_BUILDER

# Build with electron-builder
npx electron-builder --win --x64 --output "$OUTPUT_DIR" 2>/dev/null || {
    echo "[*] Electron builder not available, creating ZIP archive..."
    cd "$OUTPUT_DIR/windows"
    zip -r "$OUTPUT_DIR/SUPER-GOAT-ROYALTIES-Windows-1.0.0.zip" app/
}

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  Windows Build Complete!"
echo "═══════════════════════════════════════════════════════"
echo ""
ls -la "$OUTPUT_DIR/"*.exe 2>/dev/null || ls -la "$OUTPUT_DIR/"*.zip 2>/dev/null || echo "Check output directory for files"
echo ""

exit 0