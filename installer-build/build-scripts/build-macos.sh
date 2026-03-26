#!/bin/bash

#######################################################
# SUPER GOAT ROYALTIES APP - macOS DMG Builder
# Creates macOS installer from Linux
#######################################################

set -e

APP_NAME="SUPER GOAT ROYALTIES APP"
APP_VERSION="1.0.0"
BUILD_DIR="$(cd .. && pwd)"
ROOT_DIR="$(cd ../.. && pwd)"
OUTPUT_DIR="$BUILD_DIR/output"
RESOURCES_DIR="$BUILD_DIR/resources"

echo "═══════════════════════════════════════════════════════"
echo "  Building macOS DMG Installer"
echo "═══════════════════════════════════════════════════════"

# Create output directory
mkdir -p "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR/macos"

# Check for required tools
echo "[*] Checking macOS build tools..."

if command -v genisoimage &> /dev/null; then
    echo "    ✓ genisoimage found"
else
    echo "    ! genisoimage not found - installing..."
    sudo apt-get update && sudo apt-get install -y genisoimage
fi

# Create app bundle structure
APP_BUNDLE="$OUTPUT_DIR/macos/SUPER GOAT ROYALTIES APP.app"
mkdir -p "$APP_BUNDLE/Contents/MacOS"
mkdir -p "$APP_BUNDLE/Contents/Resources"
mkdir -p "$APP_BUNDLE/Contents/Frameworks"

# Create Info.plist
echo "[*] Creating Info.plist..."

cat > "$APP_BUNDLE/Contents/Info.plist" << 'INFO_PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleExecutable</key>
    <string>SUPER GOAT ROYALTIES</string>
    <key>CFBundleIconFile</key>
    <string>icon</string>
    <key>CFBundleIdentifier</key>
    <string>com.goatroyalties.app</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>SUPER GOAT ROYALTIES APP</string>
    <key>CFBundleDisplayName</key>
    <string>SUPER GOAT ROYALTIES APP</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.13</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>NSHumanReadableCopyright</key>
    <string>Copyright © 2024 GOAT Royalties. All rights reserved.</string>
    <key>NSMainNibFile</key>
    <string></string>
    <key>NSPrincipalClass</key>
    <string>NSApplication</string>
    <key>LSApplicationCategoryType</key>
    <string>public.app-category.music</string>
</dict>
</plist>
INFO_PLIST

# Create entitlements file for notarization
cat > "$RESOURCES_DIR/entitlements.mac.plist" << 'ENTITLEMENTS'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.disable-library-validation</key>
    <true/>
    <key>com.apple.security.network.client</key>
    <true/>
    <key>com.apple.security.network.server</key>
    <true/>
</dict>
</plist>
ENTITLEMENTS

# Copy application files
echo "[*] Copying application files..."

# Copy core application
cp -r "$ROOT_DIR/pages" "$APP_BUNDLE/Contents/MacOS/" 2>/dev/null || true
cp -r "$ROOT_DIR/components" "$APP_BUNDLE/Contents/MacOS/" 2>/dev/null || true
cp -r "$ROOT_DIR/public" "$APP_BUNDLE/Contents/MacOS/" 2>/dev/null || true
cp -r "$ROOT_DIR/styles" "$APP_BUNDLE/Contents/MacOS/" 2>/dev/null || true
cp -r "$ROOT_DIR/lib" "$APP_BUNDLE/Contents/MacOS/" 2>/dev/null || true

# Copy self-healing system
if [ -d "$ROOT_DIR/lib/self-healing" ]; then
    echo "[*] Including self-healing system..."
    mkdir -p "$APP_BUNDLE/Contents/MacOS/lib/self-healing"
    cp -r "$ROOT_DIR/lib/self-healing"/* "$APP_BUNDLE/Contents/MacOS/lib/self-healing/"
fi

# Copy Next.js build
if [ -d "$ROOT_DIR/.next" ]; then
    cp -r "$ROOT_DIR/.next" "$APP_BUNDLE/Contents/MacOS/"
fi

# Copy config files
cp "$ROOT_DIR/package.json" "$APP_BUNDLE/Contents/MacOS/" 2>/dev/null || true
cp "$ROOT_DIR/next.config.js" "$APP_BUNDLE/Contents/MacOS/" 2>/dev/null || true
cp "$ROOT_DIR/.env.local" "$APP_BUNDLE/Contents/MacOS/" 2>/dev/null || true

# Create Electron main file for macOS
echo "[*] Creating Electron wrapper..."

cat > "$APP_BUNDLE/Contents/MacOS/main.js" << 'ELECTRON_MAIN'
const { app, BrowserWindow, Menu, Tray, shell, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let tray;
let serverProcess;
const PORT = 3000;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    icon: path.join(__dirname, '../Resources/icon.icns'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'SUPER GOAT ROYALTIES APP',
    backgroundColor: '#1a1a2e',
    show: false,
    titleBarStyle: 'hiddenInset'
  });

  mainWindow.loadURL(`http://localhost:${PORT}`);
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

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

  // macOS menu
  const menuTemplate = [
    {
      label: app.name,
      submenu: [
        { label: 'About ' + app.name, role: 'about' },
        { type: 'separator' },
        { label: 'Services', role: 'services' },
        { type: 'separator' },
        { label: 'Hide ' + app.name, accelerator: 'Command+H', role: 'hide' },
        { label: 'Hide Others', accelerator: 'Command+Alt+H', role: 'hideOthers' },
        { label: 'Show All', role: 'unhide' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', click: () => { app.isQuitting = true; app.quit(); } }
      ]
    },
    {
      label: 'File',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => mainWindow.reload() }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Toggle DevTools', accelerator: 'F12', click: () => mainWindow.webContents.toggleDevTools() },
        { type: 'separator' },
        { label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', accelerator: 'Ctrl+Command+F', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Minimize', role: 'minimize' },
        { label: 'Zoom', role: 'zoom' },
        { type: 'separator' },
        { label: 'Bring All to Front', role: 'front' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Documentation', click: () => shell.openExternal('https://github.com/DJSPEEDYGA/GOAT-Royalty-App2') }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

function createTray() {
  const iconPath = path.join(__dirname, '../Resources/icon.png');
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: () => mainWindow.show() },
    { label: 'Reload', click: () => mainWindow.reload() },
    { type: 'separator' },
    { label: 'Quit', click: () => { app.isQuitting = true; app.quit(); } }
  ]);
  tray.setToolTip('SUPER GOAT ROYALTIES APP');
  tray.setContextMenu(contextMenu);
}

function startServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting Next.js server...');
    
    serverProcess = spawn('node', ['server.js'], {
      cwd: __dirname,
      env: { ...process.env, PORT: PORT.toString() },
      stdio: 'inherit'
    });

    setTimeout(() => resolve(), 3000);

    serverProcess.on('error', (err) => {
      console.error('Server error:', err);
      reject(err);
    });
  });
}

app.whenReady().then(async () => {
  try {
    await startServer();
    createWindow();
    createTray();
    
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
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
ELECTRON_MAIN

# Create preload script
cat > "$APP_BUNDLE/Contents/MacOS/preload.js" << 'PRELOAD'
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  appVersion: '1.0.0'
});
PRELOAD

# Create server.js
cat > "$APP_BUNDLE/Contents/MacOS/server.js" << 'SERVER_JS'
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

# Create package.json
cat > "$APP_BUNDLE/Contents/MacOS/package.json" << PKG_JSON
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

# Create executable launcher
cat > "$APP_BUNDLE/Contents/MacOS/SUPER GOAT ROYALTIES" << 'LAUNCHER'
#!/bin/bash
cd "$(dirname "$0")"
./node_modules/.bin/electron . || node_modules/electron/dist/Electron.app/Contents/MacOS/Electron .
LAUNCHER
chmod +x "$APP_BUNDLE/Contents/MacOS/SUPER GOAT ROYALTIES"

# Install dependencies
echo "[*] Installing npm dependencies..."
cd "$APP_BUNDLE/Contents/MacOS"
npm install --production 2>/dev/null || echo "Note: Some dependencies may need manual install"

# Create placeholder icons if not exist
if [ ! -f "$RESOURCES_DIR/icon.icns" ]; then
    echo "[*] Creating placeholder icon..."
    # Create PNG icons first
    mkdir -p /tmp/icon.iconset
    # Generate different sizes (requires ImageMagick or sips on macOS)
    if command -v convert &> /dev/null; then
        convert -size 16x16 xc:purple -fill white -gravity center -pointsize 8 -annotate 0 "GOAT" /tmp/icon.iconset/icon_16x16.png
        convert -size 32x32 xc:purple -fill white -gravity center -pointsize 16 -annotate 0 "GOAT" /tmp/icon.iconset/icon_16x16@2x.png
        convert -size 32x32 xc:purple -fill white -gravity center -pointsize 16 -annotate 0 "GOAT" /tmp/icon.iconset/icon_32x32.png
        convert -size 64x64 xc:purple -fill white -gravity center -pointsize 32 -annotate 0 "GOAT" /tmp/icon.iconset/icon_32x32@2x.png
        convert -size 128x128 xc:purple -fill white -gravity center -pointsize 64 -annotate 0 "GOAT" /tmp/icon.iconset/icon_128x128.png
        convert -size 256x256 xc:purple -fill white -gravity center -pointsize 128 -annotate 0 "GOAT" /tmp/icon.iconset/icon_128x128@2x.png
        convert -size 256x256 xc:purple -fill white -gravity center -pointsize 128 -annotate 0 "GOAT" /tmp/icon.iconset/icon_256x256.png
        convert -size 512x512 xc:purple -fill white -gravity center -pointsize 256 -annotate 0 "GOAT" /tmp/icon.iconset/icon_256x256@2x.png
        convert -size 512x512 xc:purple -fill white -gravity center -pointsize 256 -annotate 0 "GOAT" /tmp/icon.iconset/icon_512x512.png
        
        # Create icns from iconset (using png2icns or iconutil)
        png2icns "$RESOURCES_DIR/icon.icns" /tmp/icon.iconset/*.png 2>/dev/null || \
        icnsutil c "$RESOURCES_DIR/icon.icns" /tmp/icon.iconset/*.png 2>/dev/null || \
        echo "Note: Install png2icns or icnsutil for icon creation"
    fi
fi

# Copy icon
cp "$RESOURCES_DIR/icon.icns" "$APP_BUNDLE/Contents/Resources/" 2>/dev/null || true
cp "$RESOURCES_DIR/icon.png" "$APP_BUNDLE/Contents/Resources/" 2>/dev/null || true

# Create DMG
echo "[*] Creating DMG installer..."

DMG_DIR="$OUTPUT_DIR/dmg-temp"
mkdir -p "$DMG_DIR"

# Create Applications link
ln -s /Applications "$DMG_DIR/Applications"

# Copy app bundle
cp -R "$APP_BUNDLE" "$DMG_DIR/"

# Create DMG background
mkdir -p "$DMG_DIR/.background"
if command -v convert &> /dev/null; then
    convert -size 660x400 gradient:#1a1a2e-#16213e -fill white -gravity center -pointsize 24 -annotate 0 "Drag SUPER GOAT ROYALTIES APP to Applications" "$DMG_DIR/.background/background.png" 2>/dev/null || true
fi

# Create DMG
DMG_NAME="SUPER-GOAT-ROYALTIES-$APP_VERSION.dmg"
genisoimage -V "SUPER GOAT ROYALTIES APP" -D -R -apple -no-pad -o "$OUTPUT_DIR/$DMG_NAME" "$DMG_DIR" 2>/dev/null || {
    # Fallback: create a zip
    echo "[*] DMG creation failed, creating ZIP archive..."
    cd "$OUTPUT_DIR/macos"
    zip -r "$OUTPUT_DIR/SUPER-GOAT-ROYALTIES-macOS-$APP_VERSION.zip" "SUPER GOAT ROYALTIES APP.app"
}

# Cleanup
rm -rf "$DMG_DIR" 2>/dev/null || true

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  macOS Build Complete!"
echo "═══════════════════════════════════════════════════════"
echo ""
ls -la "$OUTPUT_DIR/"*.dmg 2>/dev/null || ls -la "$OUTPUT_DIR/"*.zip 2>/dev/null || echo "Check output directory for files"
echo ""

exit 0