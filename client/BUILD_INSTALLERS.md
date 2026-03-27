# SUPER GOAT ROYALTIES APP - Installer Build Guide

## Overview
This guide covers creating installer packages for the GOAT Royalty App across all platforms.

## Prerequisites
- Node.js 18+ 
- npm or yarn
- For Windows builds on Linux: Wine (optional for NSIS installer)
- For macOS builds: macOS environment recommended (or create app bundle on Linux)

## Quick Build Commands

### Build Static Export First
```bash
cd client
npm run build
```

### Windows EXE Installer
```bash
npm run electron:dist:win
```
Output: `dist/GOAT Royalty App Setup 1.0.0.exe`

### macOS DMG (requires macOS)
```bash
npm run electron:dist:mac
```
Output: `dist/GOAT Royalty App-1.0.0.dmg`

### Linux AppImage
```bash
npm run electron:dist:linux
```
Output: `dist/GOAT Royalty App-1.0.0.AppImage`

### Build All Platforms
```bash
npm run electron:dist:all
```

## Portable Version (Cross-Platform)
The portable version is a self-contained folder that runs without installation.

### Create Portable Package
```bash
./scripts/create-portable.sh
```
Output: `dist/GOAT-Royalty-App-Portable/`

## Platform-Specific Notes

### Windows
- Uses NSIS installer by default
- Code signing requires Windows SDK
- Can build on Linux using Wine

### macOS
- DMG creation requires macOS
- Code signing requires Apple Developer account
- Can create .app bundle on Linux (unsigned)

### Linux
- AppImage is most universal
- .deb for Debian/Ubuntu
- .tar.gz for any distro

## Distribution
After building, packages will be in:
- `client/dist/` - Electron installers
- `dist/portable/` - Portable versions

## File Sizes (Approximate)
- Windows EXE: ~75-100MB
- macOS DMG: ~80-100MB
- Linux AppImage: ~85-100MB
- Portable: ~50-70MB (zipped)