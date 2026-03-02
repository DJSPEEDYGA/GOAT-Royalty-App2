# Claude Code Installer — Enhanced Edition

A production-grade, multi-platform installer and packaging system for [Claude Code](https://code.claude.com), Anthropic's AI-powered coding assistant.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Enhanced Shell Script](#enhanced-shell-script)
- [Packaging for Distribution](#packaging-for-distribution)
  - [Windows (.exe)](#windows-exe-installer)
  - [macOS (.dmg)](#macos-dmg-installer)
  - [Linux (.deb)](#linux-deb-package)
  - [Portable (Cross-Platform)](#portable-cross-platform)
- [Build All Packages](#build-all-packages)
- [Project Structure](#project-structure)
- [Improvements Over Original](#improvements-over-original)
- [Requirements](#requirements)
- [Troubleshooting](#troubleshooting)

---

## Overview

This project enhances the original Claude Code shell installer with robust error handling, retry logic, colored output, progress indicators, logging, and much more — then packages it for distribution across all major platforms.

### What's Included

| Component | Description |
|-----------|-------------|
| `scripts/install-claude.sh` | Enhanced installer script (macOS/Linux) |
| `packaging/windows/` | NSIS-based Windows .exe installer + PowerShell bootstrap |
| `packaging/macos/` | macOS .dmg creator with drag-and-drop install |
| `packaging/linux/` | Debian .deb package creator |
| `packaging/portable/` | Cross-platform portable archive builder |
| `build.sh` | Master build script for all packages |

---

## Quick Start

### Direct Install (macOS / Linux)

```bash
# Download and run the enhanced installer
curl -fsSL https://your-host/install-claude.sh | bash

# Or clone and run locally
git clone https://github.com/your-org/claude-installer.git
cd claude-installer
bash scripts/install-claude.sh
```

### Install Options

```bash
# Install latest stable (default)
./scripts/install-claude.sh

# Install with verbose output
./scripts/install-claude.sh --verbose

# Install a specific version
./scripts/install-claude.sh 1.2.3

# Force reinstall
./scripts/install-claude.sh --force

# Dry run (see what would happen)
./scripts/install-claude.sh --dry-run

# Check for updates without installing
./scripts/install-claude.sh --check-update

# Uninstall
./scripts/install-claude.sh --uninstall
```

### All CLI Options

```
Options:
  -h, --help          Show help message
  -v, --verbose       Enable verbose/debug output
  -q, --quiet         Suppress non-essential output
  -f, --force         Force reinstall even if same version exists
  -n, --dry-run       Show what would be done without executing
  -d, --dir DIR       Custom installation directory
  -k, --keep          Keep downloaded binary after installation
  -r, --retries N     Number of download retry attempts (default: 3)
  --no-color          Disable colored output
  --no-verify         Skip checksum verification (not recommended)
  --uninstall         Remove Claude Code installation
  --check-update      Check for updates without installing
  --version           Show installer version

Environment Variables:
  CLAUDE_INSTALL_DIR  Override default installation directory
  CLAUDE_NO_COLOR     Disable colored output (set to 1)
  CLAUDE_VERBOSE      Enable verbose output (set to 1)
  HTTPS_PROXY         HTTP proxy for downloads
```

---

## Enhanced Shell Script

### Key Improvements Over Original

| Feature | Original | Enhanced |
|---------|----------|----------|
| Error handling | Basic `set -e` | `set -euo pipefail` + trap handlers + line-level error reporting |
| Retry logic | None | Configurable retries with exponential backoff |
| Output | Plain text | Colored, structured output with log levels |
| Logging | None | Full file logging with timestamps |
| Progress | None | Download progress bars (curl/wget) |
| Caching | None | Binary caching with checksum validation |
| Network check | None | Pre-flight connectivity test |
| Disk space | None | Pre-flight disk space verification |
| Concurrent runs | None | Lock file prevents parallel installs |
| Rosetta detection | Basic | Enhanced with additional checks |
| musl detection | Basic | Extended with multiple detection methods |
| Proxy support | None | HTTPS_PROXY environment variable |
| Uninstall | None | Built-in uninstall command |
| Update check | None | `--check-update` without installing |
| Dry run | None | `--dry-run` to preview actions |
| Version check | None | Skip install if already up-to-date |
| Help system | None | Comprehensive `--help` with examples |
| CLI options | 1 positional arg | 15+ options with validation |
| JSON parsing | Basic regex | Enhanced regex + jq when available |
| Cleanup | Basic | Signal-trapped cleanup of all temp files |

---

## Packaging for Distribution

### Windows (.exe) Installer

**Build Requirements:**
- [NSIS 3.x](https://nsis.sourceforge.io/Download) (Nullsoft Scriptable Install System)
- Windows 10+ for testing

**Build Steps:**

```powershell
# 1. Install NSIS (Windows)
winget install NSIS.NSIS
# Or download from: https://nsis.sourceforge.io/Download

# 2. Navigate to the project
cd claude-installer

# 3. Build the installer
makensis packaging/windows/installer.nsi

# 4. Output: build/ClaudeCode-Setup-2.0.0.exe
```

**What the Windows installer does:**
- Checks Windows version (10+) and architecture (64-bit)
- Downloads and installs the Claude Code binary
- Adds Claude to the user's PATH
- Creates Start Menu shortcuts
- Registers in Add/Remove Programs
- Includes a full uninstaller

**Alternative (PowerShell only):**
```powershell
# Install without the .exe — just run the PowerShell script directly
powershell -ExecutionPolicy Bypass -File packaging/windows/claude.ps1 -Action install
```

---

### macOS (.dmg) Installer

**Build Requirements:**
- macOS with Xcode Command Line Tools
- Optional: `create-dmg` for prettier DMGs (`brew install create-dmg`)

**Build Steps:**

```bash
# 1. Install optional tools
brew install create-dmg  # Optional but recommended

# 2. Build the DMG
bash packaging/macos/create-dmg.sh --version 2.0.0

# 3. Output: build/ClaudeCode-2.0.0-macos.dmg
```

**What the DMG contains:**
- `Claude Code.app` — Double-click to install
- `Applications` symlink — Drag-and-drop install
- `README.txt` — Quick start guide

**Code Signing & Notarization (for distribution):**

```bash
# Sign the app
codesign --deep --force --verify --verbose \
  --sign "Developer ID Application: Your Name (TEAM_ID)" \
  "build/dmg-staging/Claude Code.app"

# Create signed DMG
# (use create-dmg.sh which handles this)

# Notarize for Gatekeeper
xcrun notarytool submit build/ClaudeCode-2.0.0-macos.dmg \
  --apple-id "your@email.com" \
  --team-id "TEAM_ID" \
  --password "app-specific-password" \
  --wait

# Staple the notarization ticket
xcrun stapler staple build/ClaudeCode-2.0.0-macos.dmg
```

---

### Linux (.deb) Package

**Build Requirements:**
- `dpkg-deb` (pre-installed on Debian/Ubuntu)
- Optional: `fakeroot`, `lintian`

**Build Steps:**

```bash
# 1. Build for amd64
bash packaging/linux/create-deb.sh --version 2.0.0 --arch amd64

# 2. Build for arm64
bash packaging/linux/create-deb.sh --version 2.0.0 --arch arm64

# 3. Output: build/claude-code_2.0.0_amd64.deb
#            build/claude-code_2.0.0_arm64.deb
```

**Install the .deb:**

```bash
# Using dpkg
sudo dpkg -i claude-code_2.0.0_amd64.deb

# Using apt (handles dependencies)
sudo apt install ./claude-code_2.0.0_amd64.deb

# Uninstall
sudo apt remove claude-code
```

---

### Portable (Cross-Platform)

**Build Requirements:**
- `curl` or `wget`
- `tar` and `gzip` (pre-installed on most systems)

**Build Steps:**

```bash
# Build for all platforms
bash packaging/portable/create-portable.sh --version 2.0.0

# Build for a specific platform
bash packaging/portable/create-portable.sh --platform linux-x64

# Available platforms:
#   darwin-arm64, darwin-x64
#   linux-x64, linux-arm64
#   linux-x64-musl, linux-arm64-musl
```

**Output:**
```
build/ClaudeCode-VERSION-darwin-arm64-portable.tar.gz
build/ClaudeCode-VERSION-darwin-x64-portable.tar.gz
build/ClaudeCode-VERSION-linux-x64-portable.tar.gz
build/ClaudeCode-VERSION-linux-arm64-portable.tar.gz
build/ClaudeCode-VERSION-linux-x64-musl-portable.tar.gz
build/ClaudeCode-VERSION-linux-arm64-musl-portable.tar.gz
```

**Using the portable version:**

```bash
# Extract
tar -xzf ClaudeCode-2.0.0-linux-x64-portable.tar.gz

# Run
cd claude-code
./run.sh

# Or run the binary directly
./claude
```

---

## Build All Packages

The master build script can build everything in one command:

```bash
# Build all packages
./build.sh

# Build specific targets
./build.sh --macos
./build.sh --linux
./build.sh --portable
./build.sh --windows

# Override version
./build.sh --version 1.5.0

# Clean build artifacts
./build.sh --clean
```

---

## Project Structure

```
claude-installer/
├── build.sh                          # Master build script
├── LICENSE.txt                       # License file
├── README.md                         # This file
├── assets/                           # Icons and images
│   └── (place claude-icon.ico/.icns here)
├── build/                            # Build output (generated)
│   ├── ClaudeCode-Setup-2.0.0.exe
│   ├── ClaudeCode-2.0.0-macos.dmg
│   ├── claude-code_2.0.0_amd64.deb
│   └── ClaudeCode-2.0.0-*-portable.tar.gz
├── packaging/
│   ├── linux/
│   │   └── create-deb.sh            # .deb package builder
│   ├── macos/
│   │   └── create-dmg.sh            # .dmg image builder
│   ├── portable/
│   │   └── create-portable.sh       # Portable archive builder
│   └── windows/
│       ├── installer.nsi            # NSIS installer script
│       ├── claude.ps1               # PowerShell installer/launcher
│       └── claude-wrapper.cmd       # CMD wrapper
└── scripts/
    └── install-claude.sh            # Enhanced installer (main script)
```

---

## Requirements

### Runtime Requirements

| Platform | Minimum Version | Architecture |
|----------|----------------|--------------|
| macOS | 11.0 (Big Sur) | Intel x64 or Apple Silicon (arm64) |
| Linux | Kernel 4.x+ | x64 or arm64 (glibc or musl) |
| Windows | 10 (1903+) | x64 |

### Build Tool Requirements

| Package Type | Required Tools | Optional Tools |
|-------------|---------------|----------------|
| Shell script | bash 4+ | jq (better JSON parsing) |
| Windows .exe | NSIS 3.x, makensis | signtool (code signing) |
| macOS .dmg | Xcode CLI tools, hdiutil | create-dmg, codesign, notarytool |
| Linux .deb | dpkg-deb | fakeroot, lintian |
| Portable | curl/wget, tar, gzip | jq, sha256sum |

---

## Troubleshooting

### Common Issues

**"Permission denied" when running the installer:**
```bash
chmod +x scripts/install-claude.sh
```

**"Cannot reach download server":**
- Check your internet connection
- If behind a proxy: `export HTTPS_PROXY=http://proxy:port`
- Try: `curl -v https://storage.googleapis.com` to diagnose

**"Checksum verification failed":**
- The download may be corrupted — try again
- If persistent, try `--no-verify` (not recommended for production)

**"Platform not found in manifest":**
- Your OS/architecture combination may not be supported
- Check supported platforms at https://code.claude.com/docs

**macOS: "App is damaged and can't be opened":**
- The app needs to be code-signed and notarized for distribution
- For local testing: `xattr -cr "Claude Code.app"`

**Windows: "PowerShell execution policy":**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Getting Help

- **Logs:** Check `~/.claude/logs/` for detailed installation logs
- **Verbose mode:** Run with `-v` or `--verbose` for debug output
- **Dry run:** Use `--dry-run` to see what would happen without making changes
- **Documentation:** https://code.claude.com/docs

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-improvement`
3. Make your changes and test thoroughly
4. Submit a pull request

### Testing Checklist

- [ ] Shell script passes `bash -n` syntax check
- [ ] Install works on macOS (Intel)
- [ ] Install works on macOS (Apple Silicon)
- [ ] Install works on Ubuntu/Debian (x64)
- [ ] Install works on Alpine Linux (musl)
- [ ] `--uninstall` cleanly removes everything
- [ ] `--check-update` works correctly
- [ ] `--dry-run` shows correct actions without executing
- [ ] Retry logic works when network is flaky
- [ ] Concurrent install attempts are blocked by lock file

---

## License

This installer toolkit is released under the MIT License. See [LICENSE.txt](LICENSE.txt).

Claude Code itself is subject to [Anthropic's Terms of Service](https://code.claude.com/terms).