# SUPER GOAT ROYALTIES APP - Downloads

## 📦 Available Downloads

### Portable Version (Recommended)
The portable version works on all platforms (Windows, macOS, Linux) without installation.

| File | Size | Platform |
|------|------|----------|
| `SUPER-GOAT-ROYALTIES-Portable-1.0.0.zip` | ~621 MB | Windows (primary) |
| `SUPER-GOAT-ROYALTIES-Portable-1.0.0.tar.gz` | ~7.4 MB | macOS/Linux (primary) |

### Installer Scripts
Platform-specific installer scripts for easier setup:

| File | Platform | Description |
|------|----------|-------------|
| `install-windows.bat` | Windows | Creates shortcuts and installs to Program Files |
| `install-macos.sh` | macOS | Creates .app bundle in /Applications |
| `install-linux.sh` | Linux | System-wide or user installation |

---

## 🚀 Quick Start

### Option 1: Portable (No Installation)

1. Download the appropriate archive for your platform
2. Extract to any folder
3. Run the appropriate start script:
   - **Windows**: Double-click `Start-Windows.bat`
   - **macOS**: Run `./start-macos.sh` in Terminal
   - **Linux**: Run `./start-linux.sh` in Terminal
4. Open http://localhost:3000 in your browser

### Option 2: Using Installer Scripts

#### Windows
```cmd
REM Download both ZIP and installer script
REM Extract ZIP first, then run:
install-windows.bat
```

#### macOS
```bash
# Download both TAR.GZ and installer script
# Extract TAR.GZ first, then run:
chmod +x install-macos.sh
sudo ./install-macos.sh
```

#### Linux
```bash
# Download both TAR.GZ and installer script
# Extract TAR.GZ first, then run:
chmod +x install-linux.sh
sudo ./install-linux.sh
```

---

## ✅ Verification

Verify downloads using SHA-256 checksums:

```bash
# Linux/macOS
sha256sum SUPER-GOAT-ROYALTIES-Portable-1.0.0.tar.gz
sha256sum SUPER-GOAT-ROYALTIES-Portable-1.0.0.zip

# Windows (PowerShell)
Get-FileHash SUPER-GOAT-ROYALTIES-Portable-1.0.0.zip -Algorithm SHA256
```

Expected checksums:
- `0901d79239500468dbf3d695adae1b725b3b05681bf59bbc71834ba39a639e6d` (tar.gz)
- `0039ba3ced1e0d0b4d96b9fc8ee62d7aa1d8bac69497cd2fa760c5cd3ce94977` (zip)

---

## 📋 System Requirements

### Minimum Requirements
- **OS**: Windows 10+, macOS 10.15+, or Ubuntu 20.04+
- **RAM**: 4 GB minimum, 8 GB recommended
- **Disk**: 2 GB free space
- **Node.js**: Version 18.x or later (included in portable)

### Recommended
- **RAM**: 8 GB or more
- **CPU**: Modern multi-core processor
- **Network**: Internet connection for API features

---

## 🛠️ Features

- **242 API Endpoints** - Comprehensive royalty management
- **6 AI Engines** - Intelligent automation and analysis
- **Self-Healing System** - Automatic error recovery
- **Voice Commands** - Hands-free operation
- **Real-time Dashboard** - Live analytics
- **Cross-Platform** - Windows, macOS, Linux support

---

## 📁 Package Contents

```
SUPER-GOAT-ROYALTIES-Portable/
├── .next/              # Built application
├── components/         # UI components
├── data/              # Sample data
├── lib/               # Core libraries
│   └── self-healing/  # Self-healing system
├── pages/             # Application pages
├── public/            # Static assets
├── styles/            # CSS styles
├── config/            # Configuration files
├── logs/              # Application logs
├── server.js          # Main server file
├── package.json       # Dependencies
├── Start-Windows.bat  # Windows launcher
├── Start-Windows.ps1  # Windows PowerShell launcher
├── start-macos.sh     # macOS launcher
├── start-linux.sh     # Linux launcher
└── start.sh           # Generic Unix launcher
```

---

## 🔧 Troubleshooting

### Port 3000 already in use
```bash
# Find and kill process using port 3000
# Linux/macOS
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Node.js not found (Portable)
The portable version includes Node.js. If you see this error, ensure you're running from the extracted directory.

### Permission denied (macOS/Linux)
```bash
chmod +x start-linux.sh
chmod +x start-macos.sh
```

---

## 📞 Support

For issues or questions:
1. Check the README.txt in the portable package
2. Review logs in the `logs/` directory
3. Contact support with error details

---

© 2024 GOAT Royalties. All rights reserved.