# SUPER GOAT ROYALTIES APP - Quick Start Build Guide

## 🚀 One-Command Build

```bash
cd installer-build
./build-scripts/build-all.sh
```

This creates all installer packages for Windows, macOS, Linux, and Portable.

---

## 📦 Individual Builds

### Windows EXE
```bash
./build-scripts/build-windows.sh
```
**Output:** `output/SUPER-GOAT-ROYALTIES-Setup-1.0.0.exe`

**Requirements:** Wine, NSIS (install with `sudo apt-get install wine64 nsis`)

---

### macOS DMG
```bash
./build-scripts/build-macos.sh
```
**Output:** `output/SUPER-GOAT-ROYALTIES-1.0.0.dmg`

**Note:** For code signing, you need a Mac with Apple Developer account.

---

### Linux Packages
```bash
./build-scripts/build-linux.sh
```
**Output:** 
- `output/*.deb` - Debian/Ubuntu package
- `output/*.tar.gz` - Universal Linux archive
- `output/*.AppImage` - Universal Linux executable

---

### Portable Version (Recommended First Build)
```bash
./build-scripts/build-portable.sh
```
**Output:** `output/SUPER-GOAT-ROYALTIES-Portable-1.0.0.zip`

**No special tools required!** Works on any platform.

---

## 🛠️ Prerequisites

### Essential (All Builds)
```bash
# Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Build tools
npm install -g electron-builder pkg
```

### Windows Build (Cross-Compile from Linux)
```bash
sudo apt-get install -y wine64 wine32 nsis
```

### macOS Build (Cross-Compile from Linux)
```bash
sudo apt-get install -y genisoimage libarchive-tools
```

### Linux Build
```bash
sudo apt-get install -y fakeroot rpm alien
```

---

## 📁 Output Structure

```
output/
├── SUPER-GOAT-ROYALTIES-Setup-1.0.0.exe     # Windows installer
├── SUPER-GOAT-ROYALTIES-1.0.0.dmg           # macOS disk image
├── super-goat-royalties-1.0.0-amd64.deb     # Debian package
├── super-goat-royalties-1.0.0-x86_64.AppImage # Linux AppImage
├── SUPER-GOAT-ROYALTIES-Portable-1.0.0.zip  # Portable (all platforms)
└── logs/
    └── build_YYYYMMDD_HHMMSS.log            # Build logs
```

---

## 🎯 Recommended Build Order

1. **Start with Portable** - No special tools, fastest build
2. **Then Linux** - Native builds, good for testing
3. **Then Windows** - Requires Wine/NSIS
4. **Finally macOS** - May need manual tweaks for DMG

---

## ⚡ Quick Portable Build (Fastest)

```bash
# Just want a working package quickly?
cd installer-build
./build-scripts/build-portable.sh

# Output: output/SUPER-GOAT-ROYALTIES-Portable-1.0.0.zip
```

Distribute this ZIP file - users just extract and run!

---

## 🌐 Distribution

### GitHub Releases
1. Go to repository → Releases → Draft new release
2. Upload all installer files
3. Add release notes
4. Publish

### Direct Download Page
Create `pages/download.js` in your app:

```javascript
export default function Download() {
  const downloads = [
    { platform: 'Windows', file: 'SUPER-GOAT-ROYALTIES-Setup-1.0.0.exe', size: '150MB' },
    { platform: 'macOS', file: 'SUPER-GOAT-ROYALTIES-1.0.0.dmg', size: '180MB' },
    { platform: 'Linux', file: 'super-goat-royalties-1.0.0-x86_64.AppImage', size: '160MB' },
    { platform: 'Portable', file: 'SUPER-GOAT-ROYALTIES-Portable-1.0.0.zip', size: '200MB' }
  ];
  // ... render download buttons
}
```

---

## 🔧 Troubleshooting

### "electron-builder not found"
```bash
npm install -g electron-builder
```

### "Wine not found" (Windows build)
```bash
sudo apt-get install wine64 wine32
```

### "Port 3000 in use"
```bash
lsof -ti:3000 | xargs kill -9
```

### Build fails silently
Check logs in `output/logs/build_*.log`

---

## 📞 Support

- GitHub: https://github.com/DJSPEEDYGA/GOAT-Royalty-App2
- Email: support@goatroyalties.com