# Build Guide — Claude Code Installer Packages

This document provides detailed, step-by-step instructions for building each installer type from source.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Building the Windows .exe Installer](#2-building-the-windows-exe-installer)
3. [Building the macOS .dmg Installer](#3-building-the-macos-dmg-installer)
4. [Building the Linux .deb Package](#4-building-the-linux-deb-package)
5. [Building Portable Archives](#5-building-portable-archives)
6. [Building Everything at Once](#6-building-everything-at-once)
7. [Code Signing & Notarization](#7-code-signing--notarization)
8. [CI/CD Integration](#8-cicd-integration)
9. [Limitations & Notes](#9-limitations--notes)

---

## 1. Prerequisites

### 1.1 Common Requirements (All Platforms)

```bash
# These are needed regardless of which package you're building:
# - bash 4.0+ (pre-installed on macOS/Linux)
# - curl or wget (for downloading Claude binaries)
# - git (to clone this repository)

# Verify bash version
bash --version

# Verify curl
curl --version
```

### 1.2 Platform-Specific Requirements

| Package | Build OS | Required Tools | Install Command |
|---------|----------|---------------|-----------------|
| `.exe` | Windows (or Linux with NSIS) | NSIS 3.x | `winget install NSIS.NSIS` |
| `.dmg` | macOS only | Xcode CLI Tools | `xcode-select --install` |
| `.deb` | Debian/Ubuntu Linux | dpkg-deb | `sudo apt install dpkg` |
| Portable | Any Unix | tar, gzip | Pre-installed |

### 1.3 Optional (Recommended) Tools

```bash
# jq — Better JSON parsing (used by all build scripts)
# macOS:
brew install jq

# Ubuntu/Debian:
sudo apt install jq

# create-dmg — Prettier macOS DMGs
brew install create-dmg

# fakeroot — Proper .deb file ownership
sudo apt install fakeroot

# lintian — .deb package linting
sudo apt install lintian
```

---

## 2. Building the Windows .exe Installer

### 2.1 Overview

The Windows installer uses [NSIS (Nullsoft Scriptable Install System)](https://nsis.sourceforge.io), an industry-standard open-source tool for creating Windows installers. The installer:

- Provides a familiar wizard-style GUI
- Downloads the Claude Code binary during installation
- Adds Claude to the user's PATH
- Creates Start Menu shortcuts
- Registers in Windows Add/Remove Programs
- Includes a complete uninstaller

### 2.2 Step-by-Step (on Windows)

```powershell
# Step 1: Install NSIS
# Option A: Using winget
winget install NSIS.NSIS

# Option B: Download from https://nsis.sourceforge.io/Download
# Run the NSIS installer and ensure "Add to PATH" is checked

# Step 2: Verify NSIS installation
makensis /VERSION
# Should output something like: v3.09

# Step 3: Clone the repository
git clone https://github.com/your-org/claude-installer.git
cd claude-installer

# Step 4: (Optional) Add your icon
# Place a 256x256 .ico file at: assets/claude-icon.ico
# You can create one at: https://icoconvert.com/

# Step 5: Build the installer
makensis packaging/windows/installer.nsi

# Step 6: Find the output
# The .exe will be at: build/ClaudeCode-Setup-2.0.0.exe
dir build\ClaudeCode-Setup-*.exe
```

### 2.3 Step-by-Step (Cross-compile on Linux)

```bash
# NSIS can be installed on Linux for cross-compilation
# Step 1: Install NSIS
sudo apt install nsis

# Step 2: Build
makensis packaging/windows/installer.nsi

# Note: The resulting .exe can only be tested on Windows
```

### 2.4 Alternative: PowerShell-Only Install

If you don't need a GUI installer, the PowerShell script works standalone:

```powershell
# Users can install directly with:
powershell -ExecutionPolicy Bypass -File claude.ps1 -Action install

# Or for a one-liner:
irm https://your-host/claude.ps1 | iex
```

### 2.5 Customization

Edit `packaging/windows/installer.nsi` to customize:

```nsi
; Change version
!define PRODUCT_VERSION "2.0.0"

; Change publisher
!define PRODUCT_PUBLISHER "Your Company"

; Change install directory
InstallDir "$LOCALAPPDATA\Programs\YourApp"
```

---

## 3. Building the macOS .dmg Installer

### 3.1 Overview

The macOS package creates a `.dmg` disk image containing:
- A `.app` bundle with a launcher script
- An `Applications` symlink for drag-and-drop installation
- A README with quick-start instructions

### 3.2 Step-by-Step

```bash
# Step 1: Install Xcode Command Line Tools (if not already installed)
xcode-select --install

# Step 2: (Optional) Install create-dmg for prettier output
brew install create-dmg

# Step 3: Clone the repository
git clone https://github.com/your-org/claude-installer.git
cd claude-installer

# Step 4: (Optional) Add your icon
# Place a .icns file at: assets/claude-icon.icns
# Convert from PNG: 
#   mkdir icon.iconset
#   sips -z 512 512 icon.png --out icon.iconset/icon_256x256@2x.png
#   sips -z 256 256 icon.png --out icon.iconset/icon_256x256.png
#   sips -z 128 128 icon.png --out icon.iconset/icon_128x128.png
#   iconutil -c icns icon.iconset -o assets/claude-icon.icns

# Step 5: Build the DMG
bash packaging/macos/create-dmg.sh --version 2.0.0

# Step 6: Find the output
ls -lh build/ClaudeCode-*-macos.dmg

# Step 7: Test the DMG
open build/ClaudeCode-2.0.0-macos.dmg
```

### 3.3 How the .app Bundle Works

When a user double-clicks `Claude Code.app`:

1. The launcher script (`Contents/MacOS/claude-launcher`) runs
2. It checks if `claude` is already installed
3. If not installed: Opens Terminal and runs the installer script
4. If installed: Opens Terminal with `claude` running

### 3.4 Customization

The `.app` bundle's `Info.plist` can be customized in `create-dmg.sh`:

```bash
# Change bundle identifier
BUNDLE_ID="com.yourcompany.claude-code"

# Change minimum macOS version
# Edit the LSMinimumSystemVersion in the Info.plist section
```

---

## 4. Building the Linux .deb Package

### 4.1 Overview

Creates a standard Debian package that:
- Installs the Claude binary to `/usr/local/bin/claude`
- Runs Claude's setup on install (`postinst`)
- Cleans up on removal (`prerm`)
- Includes proper metadata for `apt`

### 4.2 Step-by-Step

```bash
# Step 1: Ensure dpkg-deb is available
dpkg-deb --version
# If not installed: sudo apt install dpkg

# Step 2: (Optional) Install additional tools
sudo apt install fakeroot lintian

# Step 3: Clone the repository
git clone https://github.com/your-org/claude-installer.git
cd claude-installer

# Step 4: Build for amd64 (x86_64)
bash packaging/linux/create-deb.sh --version 2.0.0 --arch amd64

# Step 5: Build for arm64 (optional)
bash packaging/linux/create-deb.sh --version 2.0.0 --arch arm64

# Step 6: Find the output
ls -lh build/*.deb

# Step 7: Test installation
sudo dpkg -i build/claude-code_2.0.0_amd64.deb

# Step 8: Verify
claude --version

# Step 9: Test uninstallation
sudo dpkg -r claude-code
```

### 4.3 Setting Up an APT Repository

For distributing via `apt`:

```bash
# 1. Create repository structure
mkdir -p repo/pool/main repo/dists/stable/main/binary-amd64

# 2. Copy .deb files
cp build/*.deb repo/pool/main/

# 3. Generate package index
cd repo
dpkg-scanpackages pool/ /dev/null | gzip -9c > dists/stable/main/binary-amd64/Packages.gz

# 4. Host the repo directory on a web server

# 5. Users add your repo:
# echo "deb https://your-host/repo stable main" | sudo tee /etc/apt/sources.list.d/claude.list
# sudo apt update
# sudo apt install claude-code
```

---

## 5. Building Portable Archives

### 5.1 Overview

Portable archives are self-contained — no installation required. Users extract and run. Each archive contains:

- The Claude binary for the target platform
- A launcher script (`run.sh` / `run.cmd`)
- A README with usage instructions
- The full installer script (for optional system-wide install)

### 5.2 Step-by-Step

```bash
# Step 1: Clone the repository
git clone https://github.com/your-org/claude-installer.git
cd claude-installer

# Step 2: Build for all platforms
bash packaging/portable/create-portable.sh --version 2.0.0

# Step 3: Or build for a specific platform
bash packaging/portable/create-portable.sh --platform linux-x64

# Available platforms:
#   darwin-arm64      macOS Apple Silicon
#   darwin-x64        macOS Intel
#   linux-x64         Linux x86_64 (glibc)
#   linux-arm64       Linux ARM64 (glibc)
#   linux-x64-musl    Linux x86_64 (Alpine/musl)
#   linux-arm64-musl  Linux ARM64 (Alpine/musl)

# Step 4: Find the output
ls -lh build/*portable*

# Step 5: Test
tar -xzf build/ClaudeCode-*-linux-x64-portable.tar.gz
cd claude-code
./run.sh --version
```

---

## 6. Building Everything at Once

### 6.1 Using the Master Build Script

```bash
# Build all packages (skips what can't be built on current OS)
./build.sh

# Build specific targets
./build.sh --portable          # Just portable archives
./build.sh --linux             # Just .deb packages
./build.sh --macos             # Just .dmg (macOS only)
./build.sh --windows           # Prepare Windows files

# Override version
./build.sh --version 1.5.0

# Clean all build artifacts
./build.sh --clean
```

### 6.2 Expected Output

```
build/
├── ClaudeCode-Setup-2.0.0.exe                    # Windows (if NSIS available)
├── ClaudeCode-2.0.0-macos.dmg                    # macOS (if on macOS)
├── claude-code_2.0.0_amd64.deb                   # Linux amd64
├── claude-code_2.0.0_arm64.deb                   # Linux arm64
├── ClaudeCode-2.0.0-darwin-arm64-portable.tar.gz # Portable macOS ARM
├── ClaudeCode-2.0.0-darwin-x64-portable.tar.gz   # Portable macOS Intel
├── ClaudeCode-2.0.0-linux-x64-portable.tar.gz    # Portable Linux x64
├── ClaudeCode-2.0.0-linux-arm64-portable.tar.gz  # Portable Linux ARM
├── ClaudeCode-2.0.0-linux-x64-musl-portable.tar.gz
├── ClaudeCode-2.0.0-linux-arm64-musl-portable.tar.gz
└── windows-installer-files/                       # Windows build files
```

---

## 7. Code Signing & Notarization

### 7.1 Windows Code Signing

```powershell
# Sign with a code signing certificate
signtool sign /f "certificate.pfx" /p "password" /tr http://timestamp.digicert.com /td sha256 /fd sha256 "build\ClaudeCode-Setup-2.0.0.exe"

# Verify signature
signtool verify /pa "build\ClaudeCode-Setup-2.0.0.exe"
```

### 7.2 macOS Code Signing & Notarization

```bash
# Sign the .app bundle
codesign --deep --force --verify --verbose \
  --sign "Developer ID Application: Your Name (TEAM_ID)" \
  --options runtime \
  "build/dmg-staging/Claude Code.app"

# Create the DMG (after signing the .app)
bash packaging/macos/create-dmg.sh

# Sign the DMG
codesign --sign "Developer ID Application: Your Name (TEAM_ID)" \
  "build/ClaudeCode-2.0.0-macos.dmg"

# Submit for notarization
xcrun notarytool submit "build/ClaudeCode-2.0.0-macos.dmg" \
  --apple-id "your@email.com" \
  --team-id "TEAM_ID" \
  --password "app-specific-password" \
  --wait

# Staple the ticket
xcrun stapler staple "build/ClaudeCode-2.0.0-macos.dmg"
```

### 7.3 Linux Package Signing

```bash
# Sign .deb with GPG
dpkg-sig --sign builder build/claude-code_2.0.0_amd64.deb

# Verify
dpkg-sig --verify build/claude-code_2.0.0_amd64.deb
```

---

## 8. CI/CD Integration

### 8.1 GitHub Actions Example

```yaml
name: Build Installers
on:
  release:
    types: [created]

jobs:
  build-linux:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build .deb packages
        run: |
          bash packaging/linux/create-deb.sh --arch amd64
          bash packaging/linux/create-deb.sh --arch arm64
      - name: Build portable archives
        run: bash packaging/portable/create-portable.sh
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: linux-packages
          path: build/*

  build-macos:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install create-dmg
        run: brew install create-dmg
      - name: Build DMG
        run: bash packaging/macos/create-dmg.sh
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: macos-packages
          path: build/*.dmg

  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install NSIS
        run: choco install nsis -y
      - name: Build installer
        run: makensis packaging/windows/installer.nsi
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: windows-packages
          path: build/*.exe
```

---

## 9. Limitations & Notes

### 9.1 Important Limitations

1. **Windows .exe**: The NSIS script creates a proper installer, but the actual Claude Code binary for Windows must exist in the GCS bucket. If Windows is not a supported platform for Claude Code, the installer will show an error during the download phase.

2. **macOS .dmg**: Can only be built on macOS. The `.app` bundle is not code-signed by default — you need an Apple Developer ID certificate for distribution outside the Mac App Store.

3. **macOS Gatekeeper**: Unsigned DMGs will trigger "unidentified developer" warnings. Users must right-click → Open, or you must sign and notarize the DMG.

4. **Linux .deb**: Only covers Debian-based distributions. For RPM-based distros (Fedora, RHEL), you would need an additional `.spec` file and `rpmbuild`.

5. **Portable version**: The portable binary is platform-specific — you cannot run a Linux binary on macOS or vice versa. Each platform needs its own archive.

6. **Binary availability**: All packaging scripts download the Claude binary from Google Cloud Storage. If a platform binary doesn't exist in the bucket, that package will fail to build.

### 9.2 Security Considerations

- **Always verify checksums**: The installer verifies SHA-256 checksums by default. Never distribute with `--no-verify`.
- **Code signing**: For public distribution, always sign your installers (Windows: Authenticode, macOS: Developer ID, Linux: GPG).
- **HTTPS only**: All downloads use HTTPS. The GCS bucket URL is hardcoded to prevent tampering.
- **No root required**: The installer runs as the current user. It does not require admin/root privileges.

### 9.3 Version Bumping

To release a new version, update the version string in:

1. `scripts/install-claude.sh` → `INSTALLER_VERSION`
2. `packaging/windows/installer.nsi` → `PRODUCT_VERSION`
3. `packaging/windows/claude.ps1` → banner text
4. `build.sh` → `VERSION` default

Or pass `--version X.Y.Z` to all build scripts to override.