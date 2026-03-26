# SUPER GOAT ROYALTIES APP - Installer Build Guide

## Overview
Complete guide for creating production-ready installer packages for Windows, macOS, Linux, and Portable versions.

## Prerequisites

### Required Tools (Linux)
```bash
# Node.js build tools
npm install -g electron-builder pkg nsis

# System dependencies
sudo apt-get update
sudo apt-get install -y wine64 wine32 nsis rpm alien fakeroot

# For macOS DMG on Linux
sudo apt-get install -y genisoimage libarchive-tools
```

### Project Structure
```
installer-build/
├── build-scripts/
│   ├── build-all.sh
│   ├── build-windows.sh
│   ├── build-macos.sh
│   ├── build-linux.sh
│   └── build-portable.sh
├── resources/
│   ├── icon.ico          # Windows icon (256x256)
│   ├── icon.icns         # macOS icon
│   ├── icon.png          # Linux/Portable icon (512x512)
│   ├── installer.nsi     # NSIS installer script
│   └── entitlements.mac.plist
├── electron/
│   ├── main.js           # Electron main process
│   ├── preload.js        # Preload script
│   └── package.json
└── output/               # Generated installers
```

---

## 1. Windows EXE Installer

### Build Command
```bash
./build-scripts/build-windows.sh
```

### Output
- `output/SUPER-GOAT-ROYALTIES-Setup-1.0.0.exe`
- NSIS-based installer with uninstaller

### Features
- Desktop shortcut creation
- Start menu integration
- Uninstaller included
- Auto-detects port conflicts

---

## 2. macOS DMG Installer

### Build Command
```bash
./build-scripts/build-macos.sh
```

### Output
- `output/SUPER-GOAT-ROYALTIES-1.0.0.dmg`
- Code-signed and notarized (requires Apple Developer account)

### Features
- Drag-to-Applications install
- Launch at login option
- Sparkle auto-update framework

---

## 3. Portable Version

### Build Command
```bash
./build-scripts/build-portable.sh
```

### Output
- `output/SUPER-GOAT-ROYALTIES-Portable-1.0.0.zip`
- No installation required

### Features
- Self-contained
- Runs from USB drive
- All features preserved

---

## 4. Linux Packages

### Available Formats
- `.deb` - Debian/Ubuntu
- `.rpm` - Red Hat/Fedora
- `.AppImage` - Universal Linux
- `.tar.gz` - Archive

### Build Command
```bash
./build-scripts/build-linux.sh
```

---

## Quick Start

```bash
# Build all installers
./build-scripts/build-all.sh

# Or build individually
./build-scripts/build-windows.sh
./build-scripts/build-macos.sh
./build-scripts/build-linux.sh
./build-scripts/build-portable.sh
```

---

## Distribution Hosting

### Recommended Platforms
1. **GitHub Releases** - Free, integrated with repo
2. **AWS S3** - Professional, CDN available
3. **DigitalOcean Spaces** - Cost-effective
4. **Vercel** - Automatic deployments

### Download Page
Create a download page at `/download` on your production site.