# SUPER GOAT ROYALTIES APP - Installer Build System

Complete build system for creating distribution packages for Windows, macOS, and Linux.

## Quick Start

```bash
# Make scripts executable
chmod +x installer-build-system/*.sh

# Run the universal build script
cd installer-build-system
./build-all.sh
```

## System Requirements

### For Building on Linux (Current Environment)

| Component | Requirement |
|-----------|-------------|
| Node.js | 18+ |
| npm | 9+ |
| RAM | 4GB minimum, 8GB recommended |
| Disk Space | 5GB free |
| OS | Linux (Debian/Ubuntu recommended) |

### Cross-Platform Build Capabilities

| Target Platform | Build on Linux | Limitations |
|-----------------|----------------|-------------|
| Windows (.exe) | ✅ Yes | No code signing (unsigned) |
| macOS (.dmg) | ⚠️ Limited | Creates unsigned app, better to build on macOS |
| Linux (.AppImage, .deb) | ✅ Full | None |
| Portable | ✅ Full | None |

---

## Build Scripts Overview

### 1. Universal Build Script (`build-all.sh`)

Interactive script that builds all or selected platforms.

```bash
./build-all.sh
```

**Options:**
1. Build All (Windows, macOS, Linux, Portable)
2. Windows Only (.exe + Portable)
3. macOS Only (.dmg)
4. Linux Only (.AppImage, .deb, .tar.gz)
5. Portable Version Only
6. Quick Build (Current Platform)

### 2. Windows Build (`build-windows.js`)

Creates Windows installers using electron-builder.

```bash
node build-windows.js
```

**Output:**
- `SUPER GOAT ROYALTIES APP Setup 1.0.0.exe` - NSIS Installer
- `SUPER-GOAT-ROYALTIES-APP-Portable.exe` - Portable executable

### 3. macOS Build (`build-macos.js`)

Creates macOS disk images and zip archives.

```bash
node build-macos.js
```

**Output:**
- `SUPER GOAT ROYALTIES APP-1.0.0.dmg` - Disk Image
- `SUPER GOAT ROYALTIES APP-1.0.0-mac.zip` - ZIP Archive

**Note:** Building macOS apps on Linux creates unsigned binaries. For production:
- Run on a macOS machine with Xcode installed
- Enable code signing with Apple Developer certificate

### 4. Linux Build (`build-linux.js`)

Creates Linux packages.

```bash
node build-linux.js
```

**Output:**
- `super-goat-royalties-app-1.0.0.AppImage` - Universal Linux package
- `super-goat-royalties-app_1.0.0_amd64.deb` - Debian/Ubuntu package
- `super-goat-royalties-app-1.0.0.tar.gz` - Compressed archive

### 5. Portable Build (`build-portable.sh`)

Creates a no-installation required version.

```bash
./build-portable.sh
```

**Output:**
- `super-goat-royalties-app-portable-windows.zip` - For Windows users
- `super-goat-royalties-app-portable-unix.tar.gz` - For Linux/macOS users

---

## Detailed Build Instructions

### Step 1: Prepare Environment

```bash
# Navigate to project root
cd /workspace/GOAT-Royalty-App2

# Install dependencies
npm install

# Build Next.js application
npm run build
```

### Step 2: Create Application Icons

**Windows (.ico):**
```bash
# Requires ImageMagick or online converter
# Recommended size: 256x256 pixels
# Place at: public/icon.ico
```

**macOS (.icns):**
```bash
# Use iconutil on macOS or online converter
# Recommended size: 512x512 pixels
# Place at: public/icon.icns
```

**Linux (PNG):**
```bash
# Multiple sizes: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256
# Place at: public/icon.png
```

### Step 3: Build Installers

#### Windows (.exe)

```bash
# Method 1: Using npm script
npm run build:win

# Method 2: Using Node.js script
node installer-build-system/build-windows.js

# Method 3: Using electron-builder directly
npx electron-builder --win --x64
```

**Output Location:** `dist/` directory

#### macOS (.dmg)

```bash
# On Linux (creates unsigned app)
npx electron-builder --mac --dir

# On macOS (creates signed DMG)
npm run electron:build:mac
```

#### Linux Packages

```bash
# Build all Linux packages
npx electron-builder --linux

# Build specific format
npx electron-builder --linux appimage  # .AppImage
npx electron-builder --linux deb       # .deb
npx electron-builder --linux tar.gz    # .tar.gz
```

### Step 4: Create Portable Version

```bash
cd installer-build-system
./build-portable.sh
```

---

## Platform-Specific Considerations

### Windows Installer Features

| Feature | Description |
|---------|-------------|
| NSIS Installer | Full installation with desktop/start menu shortcuts |
| Portable EXE | No installation, runs from any location |
| Auto-update | Can be enabled with update server |
| Code Signing | Requires Windows certificate (disabled by default) |

### macOS Installer Features

| Feature | Linux Build | macOS Build |
|---------|-------------|-------------|
| DMG Creation | ⚠️ Limited | ✅ Full |
| Code Signing | ❌ No | ✅ Yes |
| Notarization | ❌ No | ✅ Yes |
| Universal Binary | ❌ No | ✅ Yes (x64 + arm64) |

### Linux Package Features

| Format | Description | Target Systems |
|--------|-------------|----------------|
| AppImage | Universal, no installation | All Linux distros |
| .deb | Debian package | Ubuntu, Debian, Mint |
| .tar.gz | Compressed archive | All systems |

---

## Self-Healing System Integration

The installers include the application's self-healing capabilities:

### How It Works

1. **Automatic Recovery**: The app monitors for crashes and restarts automatically
2. **Health Checks**: Periodic checks ensure all services are running
3. **Auto-Repair**: Corrupted files are detected and repaired from backup
4. **Rollback**: Failed updates automatically roll back to last known good state

### Files Included

- `lib/automation/workflow-manager.js` - Automation framework
- `start-server.js` - Server startup with health monitoring
- `main.js` - Electron main process with crash handling

---

## Distribution Recommendations

### Hosting Options

| Option | Cost | Best For |
|--------|------|----------|
| GitHub Releases | Free | Open source projects |
| AWS S3 | Pay per use | Global distribution |
| Hostinger VPS | $5-10/month | Full control |
| DigitalOcean Spaces | $5/month | CDN-backed |

### GitHub Releases Setup

```bash
# Create a release
gh release create v1.0.0 \
  dist/*.exe \
  dist/*.dmg \
  dist/*.AppImage \
  dist/*.deb \
  --title "SUPER GOAT ROYALTIES APP v1.0.0" \
  --notes "Release notes here"
```

### Download Page Setup

Use the provided `download-page.html` to create a professional download page.

---

## Testing Installers

### Windows Testing Checklist

- [ ] Installer runs without errors
- [ ] Desktop shortcut created
- [ ] Start menu entry created
- [ ] Application launches correctly
- [ ] Uninstaller works properly
- [ ] Portable version runs from USB drive

### macOS Testing Checklist

- [ ] DMG mounts correctly
- [ ] App appears in Applications folder
- [ ] App launches without warnings (if signed)
- [ ] All features work correctly

### Linux Testing Checklist

- [ ] AppImage is executable
- [ ] .deb installs without errors
- [ ] App appears in application menu
- [ ] All dependencies are satisfied

---

## Troubleshooting

### Common Issues

**"electron-builder not found"**
```bash
npm install --save-dev electron-builder
```

**"Cannot find module 'electron'"**
```bash
npm install --save-dev electron
```

**Windows build fails on Linux**
```bash
# Install Wine (for code signing)
sudo apt-get install wine64

# Or disable signing
export CSC_IDENTITY_AUTO_DISCOVERY=false
```

**macOS build fails**
```bash
# On non-macOS, build unsigned
npx electron-builder --mac --dir
```

**Out of memory during build**
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"
```

---

## Build Output Summary

After running all builds, you'll have:

```
dist/
├── SUPER GOAT ROYALTIES APP Setup 1.0.0.exe    # Windows NSIS Installer
├── SUPER-GOAT-ROYALTIES-APP-Portable.exe       # Windows Portable
├── SUPER GOAT ROYALTIES APP-1.0.0.dmg          # macOS Disk Image
├── SUPER GOAT ROYALTIES APP-1.0.0-mac.zip      # macOS ZIP
├── super-goat-royalties-app-1.0.0.AppImage     # Linux Universal
├── super-goat-royalties-app_1.0.0_amd64.deb    # Debian Package
└── super-goat-royalties-app-1.0.0.tar.gz       # Linux Archive

portable-builds/
└── portable/
    ├── super-goat-royalties-app-portable-windows.zip
    └── super-goat-royalties-app-portable-unix.tar.gz
```

---

## Support

For issues with building:
- Email: info@goatroyaltyapp.com
- GitHub: https://github.com/DJSPEEDYGA/GOAT-Royalty-App2

---

*Copyright (c) 2024 GOAT Royalty Team. All Rights Reserved.*