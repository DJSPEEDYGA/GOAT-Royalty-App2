# GOAT Royalty App - Build Instructions

## Overview

The GOAT Royalty App is a Next.js + Electron application that requires specific build steps to create distributable installers for different platforms.

## Prerequisites

Before building, ensure you have:
- Node.js 16 or later
- npm or yarn package manager
- At least 2GB free disk space
- Internet connection for downloading dependencies

## Build Process

### 1. Install Dependencies

```bash
# Navigate to project directory
cd GOAT-Royalty-App2

# Install all required dependencies
npm install

# Install additional build tools
npm install --save-dev electron-builder
```

### 2. Build the Next.js Application

```bash
# Build the Next.js frontend
npm run build
```

This creates an optimized production build in the `.next` directory.

### 3. Configure Electron Builder (package.json)

The `package.json` file should have a build configuration section:

```json
{
  "build": {
    "appId": "com.goat.royaltyapp",
    "productName": "GOAT Royalty App",
    "directories": {
      "output": "dist"
    },
    "mac": {
      "category": "public.app-category.business",
      "target": [
        "dmg",
        "zip"
      ]
    },
    "win": {
      "target": [
        "nsis",
        "zip"
      ]
    },
    "linux": {
      "target": [
        "AppImage",
        "deb",
        "rpm"
      ]
    }
  }
}
```

### 4. Create Distributable Installers

```bash
# For macOS (.dmg)
npm run electron-builder -- --mac

# For Windows (.exe)
npm run electron-builder -- --win

# For Linux (.AppImage, .deb, .rpm)
npm run electron-builder -- --linux

# For all platforms
npm run electron-builder -- --mac --win --linux
```

## Platform-Specific Notes

### macOS
- Requires macOS to build .dmg files properly
- May need Xcode command line tools
- Code signing may be required for distribution

### Windows
- Can be built on any platform
- NSIS installer is recommended for Windows

### Linux
- Can be built on any platform
- Multiple package formats available

## Output Location

After building, the distributable files will be in the `dist` directory:
- macOS: `dist/GOAT Royalty App-1.0.0.dmg`
- Windows: `dist/GOAT Royalty App Setup 1.0.0.exe`
- Linux: `dist/GOAT Royalty App-1.0.0.AppImage`

## Troubleshooting

### Common Issues

1. **Missing dependencies:**
   ```bash
   npm install
   npm audit fix
   ```

2. **Electron version conflicts:**
   ```bash
   npm audit fix --force
   ```

3. **Build errors:**
   - Clean previous builds: `rm -rf .next dist node_modules`
   - Reinstall dependencies: `npm install`
   - Rebuild: `npm run build`

4. **Platform-specific issues:**
   - macOS: Install Xcode command line tools
   - Windows: Install Windows Build Tools
   - Linux: Install required system dependencies

### Development Mode

To test the application during development:
```bash
# Run in development mode
npm run dev

# Run Electron app in development
npm run electron
```

## GitHub Release Process

To create a GitHub release with the built files:

1. Create a new release on GitHub:
   ```bash
   gh release create v1.0.0 --title "GOAT Royalty App v1.0.0" --notes "Initial release"
   ```

2. Upload the built files:
   ```bash
   gh release upload v1.0.0 dist/*.dmg dist/*.exe dist/*.AppImage
   ```

## Automated Builds

For automated builds using GitHub Actions, create a workflow file in `.github/workflows/release.yml`:

```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ${{ matrix.os }}
    
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]
        
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build Next.js app
        run: npm run build
        
      - name: Build Electron app
        run: npm run electron-builder -- --${{ matrix.os == 'macos-latest' && 'mac' || matrix.os == 'ubuntu-latest' && 'linux' || 'win' }}
        
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            dist/*.dmg
            dist/*.exe
            dist/*.AppImage
            dist/*.deb
            dist/*.rpm
            dist/*.zip
```

## Security Considerations

1. **Code Signing:**
   - Recommended for production releases
   - Required for macOS notarization
   - Improves user trust

2. **Dependency Updates:**
   - Regularly update dependencies
   - Monitor for security vulnerabilities
   - Use `npm audit` to check for issues

3. **Distribution:**
   - Only distribute from trusted sources
   - Verify file integrity with checksums
   - Provide clear installation instructions

## Support

For issues with building or running the GOAT Royalty App:
1. Check the GitHub repository issues
2. Ensure all prerequisites are installed
3. Clean and rebuild if experiencing problems
4. Contact support through GitHub issues

---

**Document Version:** 1.0  
**Last Updated:** October 2024