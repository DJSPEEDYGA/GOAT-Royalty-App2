#!/bin/bash

#######################################################
# SUPER GOAT ROYALTIES APP - Master Build Script
# Creates all installer packages from Linux
#######################################################

set -e  # Exit on error

# Configuration
APP_NAME="SUPER GOAT ROYALTIES APP"
APP_VERSION="1.0.0"
BUILD_DIR="$(cd .. && pwd)"
OUTPUT_DIR="$BUILD_DIR/output"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   SUPER GOAT ROYALTIES APP - Installer Build System   ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}App Name:${NC} $APP_NAME"
echo -e "${GREEN}Version:${NC} $APP_VERSION"
echo -e "${GREEN}Build Date:${NC} $(date)"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR/logs"

# Log file
LOG_FILE="$OUTPUT_DIR/logs/build_$TIMESTAMP.log"
exec > >(tee -a "$LOG_FILE") 2>&1

echo -e "${YELLOW}[*] Starting build process...${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}[*] Checking prerequisites...${NC}"

check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} $1 installed"
        return 0
    else
        echo -e "  ${RED}✗${NC} $1 not found"
        return 1
    fi
}

PREREQ_OK=true

# Essential tools
check_command "node" || PREREQ_OK=false
check_command "npm" || PREREQ_OK=false
check_command "git" || PREREQ_OK=false

# Build tools (warn only)
echo ""
echo -e "${YELLOW}[*] Build tools status:${NC}"
check_command "electron-builder" || echo -e "  ${YELLOW}Will install via npm${NC}"
check_command "wine64" || echo -e "  ${YELLOW}Required for Windows builds${NC}"
check_command "nsis" || echo -e "  ${YELLOW}Required for Windows installer${NC}"

echo ""

if [ "$PREREQ_OK" = false ]; then
    echo -e "${RED}Error: Missing essential prerequisites. Please install Node.js and npm.${NC}"
    exit 1
fi

# Install build dependencies
echo -e "${YELLOW}[*] Installing build dependencies...${NC}"
npm install -g electron-builder pkg 2>/dev/null || true

# Build the application first
echo ""
echo -e "${YELLOW}[*] Building Next.js application...${NC}"
cd "$BUILD_DIR"
npm run build 2>/dev/null || echo -e "${YELLOW}Note: Build may have warnings${NC}"

# Create build timestamp
echo "$TIMESTAMP" > "$OUTPUT_DIR/build_timestamp.txt"

# Run individual build scripts
BUILD_SUCCESS=true
BUILD_RESULTS=()

# Build Windows
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Building Windows EXE Installer...${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
if [ -f "$BUILD_DIR/installer-build/build-scripts/build-windows.sh" ]; then
    if bash "$BUILD_DIR/installer-build/build-scripts/build-windows.sh"; then
        BUILD_RESULTS+=("Windows EXE: SUCCESS")
        echo -e "${GREEN}✓ Windows build completed${NC}"
    else
        BUILD_RESULTS+=("Windows EXE: FAILED")
        echo -e "${RED}✗ Windows build failed${NC}"
        BUILD_SUCCESS=false
    fi
else
    BUILD_RESULTS+=("Windows EXE: SKIPPED (script not found)")
fi

# Build macOS
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Building macOS DMG Installer...${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
if [ -f "$BUILD_DIR/installer-build/build-scripts/build-macos.sh" ]; then
    if bash "$BUILD_DIR/installer-build/build-scripts/build-macos.sh"; then
        BUILD_RESULTS+=("macOS DMG: SUCCESS")
        echo -e "${GREEN}✓ macOS build completed${NC}"
    else
        BUILD_RESULTS+=("macOS DMG: FAILED")
        echo -e "${RED}✗ macOS build failed${NC}"
    fi
else
    BUILD_RESULTS+=("macOS DMG: SKIPPED (script not found)")
fi

# Build Linux
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Building Linux Packages...${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
if [ -f "$BUILD_DIR/installer-build/build-scripts/build-linux.sh" ]; then
    if bash "$BUILD_DIR/installer-build/build-scripts/build-linux.sh"; then
        BUILD_RESULTS+=("Linux Packages: SUCCESS")
        echo -e "${GREEN}✓ Linux build completed${NC}"
    else
        BUILD_RESULTS+=("Linux Packages: FAILED")
        echo -e "${RED}✗ Linux build failed${NC}"
    fi
else
    BUILD_RESULTS+=("Linux Packages: SKIPPED (script not found)")
fi

# Build Portable
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Building Portable Version...${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
if [ -f "$BUILD_DIR/installer-build/build-scripts/build-portable.sh" ]; then
    if bash "$BUILD_DIR/installer-build/build-scripts/build-portable.sh"; then
        BUILD_RESULTS+=("Portable: SUCCESS")
        echo -e "${GREEN}✓ Portable build completed${NC}"
    else
        BUILD_RESULTS+=("Portable: FAILED")
        echo -e "${RED}✗ Portable build failed${NC}"
        BUILD_SUCCESS=false
    fi
else
    BUILD_RESULTS+=("Portable: SKIPPED (script not found)")
fi

# Summary
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                  BUILD SUMMARY                        ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

for result in "${BUILD_RESULTS[@]}"; do
    if [[ $result == *"SUCCESS"* ]]; then
        echo -e "  ${GREEN}✓${NC} $result"
    elif [[ $result == *"FAILED"* ]]; then
        echo -e "  ${RED}✗${NC} $result"
    else
        echo -e "  ${YELLOW}○${NC} $result"
    fi
done

echo ""
echo -e "${GREEN}Output Directory:${NC} $OUTPUT_DIR"
echo -e "${GREEN}Log File:${NC} $LOG_FILE"
echo ""

# List generated files
if ls $OUTPUT_DIR/*.exe 1>/dev/null 2>&1; then
    echo -e "${GREEN}Windows Installers:${NC}"
    ls -lh $OUTPUT_DIR/*.exe 2>/dev/null || true
fi

if ls $OUTPUT_DIR/*.dmg 1>/dev/null 2>&1; then
    echo -e "${GREEN}macOS Installers:${NC}"
    ls -lh $OUTPUT_DIR/*.dmg 2>/dev/null || true
fi

if ls $OUTPUT_DIR/*.AppImage 1>/dev/null 2>&1; then
    echo -e "${GREEN}Linux AppImage:${NC}"
    ls -lh $OUTPUT_DIR/*.AppImage 2>/dev/null || true
fi

if ls $OUTPUT_DIR/*.deb 1>/dev/null 2>&1; then
    echo -e "${GREEN}Linux DEB:${NC}"
    ls -lh $OUTPUT_DIR/*.deb 2>/dev/null || true
fi

if ls $OUTPUT_DIR/*-portable*.zip 1>/dev/null 2>&1; then
    echo -e "${GREEN}Portable Version:${NC}"
    ls -lh $OUTPUT_DIR/*-portable*.zip 2>/dev/null || true
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Build process completed!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

# Exit with appropriate code
if [ "$BUILD_SUCCESS" = true ]; then
    exit 0
else
    exit 1
fi