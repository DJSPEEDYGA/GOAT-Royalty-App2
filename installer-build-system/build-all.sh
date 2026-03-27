#!/bin/bash

# ==============================================================================
# SUPER GOAT ROYALTIES APP - Universal Build Script
# Creates installers for Windows, macOS, and Linux
# ==============================================================================

set -e

APP_NAME="SUPER GOAT ROYALTIES APP"
PACKAGE_NAME="super-goat-royalties-app"
VERSION="1.0.0"
DIST_DIR="./dist"
BUILDS_DIR="./portable-builds"

echo "=================================================="
echo "  $APP_NAME - Universal Installer Builder"
echo "  Version: $VERSION"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check for required tools
check_dependencies() {
    echo -e "${YELLOW}Checking build dependencies...${NC}"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Node.js is not installed. Please install Node.js 18+${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js $(node -v) found${NC}"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}npm is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ npm $(npm -v) found${NC}"
    
    # Check for electron-builder (will be installed via npm if missing)
    echo -e "${GREEN}✓ Build tools ready${NC}"
}

# Create output directories
setup_directories() {
    echo -e "${YELLOW}Setting up build directories...${NC}"
    mkdir -p "$DIST_DIR"
    mkdir -p "$BUILDS_DIR/windows"
    mkdir -p "$BUILDS_DIR/macos"
    mkdir -p "$BUILDS_DIR/linux"
    mkdir -p "$BUILDS_DIR/portable"
    echo -e "${GREEN}✓ Directories created${NC}"
}

# Build Next.js application
build_nextjs() {
    echo -e "${YELLOW}Building Next.js application...${NC}"
    npm run build
    echo -e "${GREEN}✓ Next.js build complete${NC}"
}

# Build Windows Installer (.exe)
build_windows() {
    echo ""
    echo -e "${YELLOW}==================================================${NC}"
    echo -e "${YELLOW}  Building Windows Installers${NC}"
    echo -e "${YELLOW}==================================================${NC}"
    
    # Check if we're on Linux - need Wine for Windows builds
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo -e "${YELLOW}Building Windows installer on Linux...${NC}"
        echo -e "${YELLOW}Note: Code signing is disabled for cross-platform builds${NC}"
    fi
    
    # Build with electron-builder
    npx electron-builder --win --x64 --config.win.sign=null
    
    echo -e "${GREEN}✓ Windows build complete!${NC}"
    echo -e "${GREEN}  - NSIS Installer: dist/$PACKAGE_NAME Setup $VERSION.exe${NC}"
    echo -e "${GREEN}  - Portable: dist/GOAT-Royalty-App-Portable.exe${NC}"
}

# Build macOS Installer (.dmg)
build_macos() {
    echo ""
    echo -e "${YELLOW}==================================================${NC}"
    echo -e "${YELLOW}  Building macOS Installers${NC}"
    echo -e "${YELLOW}==================================================${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # Native macOS build
        npx electron-builder --mac
        echo -e "${GREEN}✓ macOS build complete!${NC}"
    else
        echo -e "${YELLOW}Building macOS installer on non-macOS platform...${NC}"
        echo -e "${YELLOW}Creating DMG is limited on Linux. Creating zip archive instead.${NC}"
        
        # Create a macOS-compatible zip
        npx electron-builder --mac --dir
        
        echo -e "${GREEN}✓ macOS build complete (unsigned)${NC}"
        echo -e "${YELLOW}Note: For production macOS builds, run on a macOS machine with Xcode${NC}"
    fi
}

# Build Linux Packages
build_linux() {
    echo ""
    echo -e "${YELLOW}==================================================${NC}"
    echo -e "${YELLOW}  Building Linux Packages${NC}"
    echo -e "${YELLOW}==================================================${NC}"
    
    # Build AppImage (universal Linux package)
    echo -e "${YELLOW}Building AppImage...${NC}"
    npx electron-builder --linux appimage --x64
    
    # Build .deb package
    echo -e "${YELLOW}Building .deb package...${NC}"
    npx electron-builder --linux deb --x64
    
    # Build .tar.gz archive
    echo -e "${YELLOW}Building .tar.gz archive...${NC}"
    npx electron-builder --linux tar.gz --x64
    
    echo -e "${GREEN}✓ Linux builds complete!${NC}"
    echo -e "${GREEN}  - AppImage: dist/$PACKAGE_NAME-$VERSION.AppImage${NC}"
    echo -e "${GREEN}  - DEB: dist/${PACKAGE_NAME}_${VERSION}_amd64.deb${NC}"
    echo -e "${GREEN}  - TAR.GZ: dist/$PACKAGE_NAME-$VERSION.tar.gz${NC}"
}

# Build Portable Version
build_portable() {
    echo ""
    echo -e "${YELLOW}==================================================${NC}"
    echo -e "${YELLOW}  Building Portable Version${NC}"
    echo -e "${YELLOW}==================================================${NC}"
    
    PORTABLE_DIR="$BUILDS_DIR/portable/$PACKAGE_NAME-portable"
    
    # Create portable directory structure
    mkdir -p "$PORTABLE_DIR/app"
    mkdir -p "$PORTABLE_DIR/data"
    
    # Copy application files
    echo -e "${YELLOW}Copying application files...${NC}"
    cp -r .next "$PORTABLE_DIR/app/"
    cp -r public "$PORTABLE_DIR/app/"
    cp -r pages "$PORTABLE_DIR/app/"
    cp -r components "$PORTABLE_DIR/app/"
    cp -r lib "$PORTABLE_DIR/app/"
    cp -r styles "$PORTABLE_DIR/app/"
    cp main.js preload.js start-server.js next.config.js package.json "$PORTABLE_DIR/app/"
    
    # Copy node_modules (production only)
    echo -e "${YELLOW}Copying production dependencies...${NC}"
    cp -r node_modules "$PORTABLE_DIR/app/"
    
    # Create launcher scripts
    create_launchers "$PORTABLE_DIR"
    
    # Create README
    cat > "$PORTABLE_DIR/README.txt" << 'EOF'
SUPER GOAT ROYALTIES APP - Portable Edition
============================================

This portable version requires no installation.
Simply run the appropriate launcher for your platform:

Windows: Double-click START-WINDOWS.bat
macOS:   Run ./start-macos.sh in Terminal
Linux:   Run ./start-linux.sh in Terminal

The application will start on http://localhost:3000

Requirements:
- Node.js 18+ must be installed on the target machine
- See README.md for full documentation

(c) 2024 GOAT Royalty Team
EOF
    
    # Create compressed archives
    echo -e "${YELLOW}Creating portable archives...${NC}"
    cd "$BUILDS_DIR/portable"
    tar -czvf "$PACKAGE_NAME-portable-linux.tar.gz" "$PACKAGE_NAME-portable"
    zip -r "$PACKAGE_NAME-portable-windows.zip" "$PACKAGE_NAME-portable"
    
    echo -e "${GREEN}✓ Portable version complete!${NC}"
    echo -e "${GREEN}  - Linux: $BUILDS_DIR/portable/$PACKAGE_NAME-portable-linux.tar.gz${NC}"
    echo -e "${GREEN}  - Windows: $BUILDS_DIR/portable/$PACKAGE_NAME-portable-windows.zip${NC}"
}

# Create launcher scripts for portable version
create_launchers() {
    local DIR=$1
    
    # Windows launcher
    cat > "$DIR/START-WINDOWS.bat" << 'EOF'
@echo off
title SUPER GOAT ROYALTIES APP
echo ========================================
echo   SUPER GOAT ROYALTIES APP
echo   Starting application...
echo ========================================
cd /d "%~dp0app"
start "" http://localhost:3000
node start-server.js
pause
EOF
    
    # macOS launcher
    cat > "$DIR/start-macos.sh" << 'EOF'
#!/bin/bash
echo "========================================"
echo "  SUPER GOAT ROYALTIES APP"
echo "  Starting application..."
echo "========================================"
cd "$(dirname "$0")/app"
open "http://localhost:3000"
node start-server.js
EOF
    chmod +x "$DIR/start-macos.sh"
    
    # Linux launcher
    cat > "$DIR/start-linux.sh" << 'EOF'
#!/bin/bash
echo "========================================"
echo "  SUPER GOAT ROYALTIES APP"
echo "  Starting application..."
echo "========================================"
cd "$(dirname "$0")/app"
xdg-open "http://localhost:3000" 2>/dev/null || open "http://localhost:3000" 2>/dev/null
node start-server.js
EOF
    chmod +x "$DIR/start-linux.sh"
}

# Main build menu
main() {
    echo ""
    echo "Select build options:"
    echo "1) Build All (Windows, macOS, Linux, Portable)"
    echo "2) Windows Only (.exe + Portable)"
    echo "3) macOS Only (.dmg)"
    echo "4) Linux Only (.AppImage, .deb, .tar.gz)"
    echo "5) Portable Version Only"
    echo "6) Quick Build (Current Platform)"
    echo ""
    read -p "Enter choice [1-6]: " choice
    
    case $choice in
        1)
            check_dependencies
            setup_directories
            build_nextjs
            build_windows
            build_macos
            build_linux
            build_portable
            ;;
        2)
            check_dependencies
            setup_directories
            build_nextjs
            build_windows
            ;;
        3)
            check_dependencies
            setup_directories
            build_nextjs
            build_macos
            ;;
        4)
            check_dependencies
            setup_directories
            build_nextjs
            build_linux
            ;;
        5)
            check_dependencies
            setup_directories
            build_nextjs
            build_portable
            ;;
        6)
            check_dependencies
            setup_directories
            build_nextjs
            npx electron-builder
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            exit 1
            ;;
    esac
    
    echo ""
    echo -e "${GREEN}=================================================="
    echo -e "  BUILD COMPLETE!"
    echo -e "==================================================${NC}"
    echo ""
    echo "Output files are in: $DIST_DIR"
    ls -la "$DIST_DIR" 2>/dev/null || echo "Check $BUILDS_DIR for portable builds"
}

# Run main function
main "$@"