#!/bin/bash

# GOAT Royalty App - Multi-Platform Installer Build Script
# This script creates installers for Windows, macOS, and Linux

echo "=============================================="
echo "GOAT ROYALTY APP - INSTALLER BUILDER"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GOLD='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${GOLD}Step 1: Installing dependencies...${NC}"
npm install

echo ""
echo -e "${GOLD}Step 2: Building Next.js application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed! Please check the errors above.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Next.js build completed successfully!${NC}"
echo ""

# Create dist directory
mkdir -p dist

echo -e "${GOLD}Step 3: Building desktop installers...${NC}"
echo ""

# Parse command line arguments
BUILD_ALL=false
BUILD_WIN=false
BUILD_MAC=false
BUILD_LINUX=false
BUILD_PORTABLE=false

if [ "$1" == "" ] || [ "$1" == "all" ]; then
    BUILD_ALL=true
fi

if [ "$1" == "win" ] || [ "$BUILD_ALL" == true ]; then
    BUILD_WIN=true
fi

if [ "$1" == "mac" ] || [ "$BUILD_ALL" == true ]; then
    BUILD_MAC=true
fi

if [ "$1" == "linux" ] || [ "$BUILD_ALL" == true ]; then
    BUILD_LINUX=true
fi

if [ "$1" == "portable" ] || [ "$BUILD_ALL" == true ]; then
    BUILD_PORTABLE=true
fi

# Build Windows EXE
if [ "$BUILD_WIN" == true ]; then
    echo -e "${GOLD}Building Windows EXE installer...${NC}"
    npx electron-builder --win --x64
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Windows EXE installer created!${NC}"
        ls -la dist/*.exe 2>/dev/null
    else
        echo -e "${RED}✗ Windows build failed!${NC}"
    fi
    echo ""
fi

# Build Portable version
if [ "$BUILD_PORTABLE" == true ]; then
    echo -e "${GOLD}Building Portable version...${NC}"
    npx electron-builder --win portable --x64
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Portable version created!${NC}"
        ls -la dist/*Portable*.exe 2>/dev/null
    else
        echo -e "${RED}✗ Portable build failed!${NC}"
    fi
    echo ""
fi

# Build macOS DMG
if [ "$BUILD_MAC" == true ]; then
    echo -e "${GOLD}Building macOS DMG installer...${NC}"
    # Note: Building macOS apps on Linux requires special setup
    # This will create the build but may not be signed
    npx electron-builder --mac --x64
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ macOS DMG installer created!${NC}"
        ls -la dist/*.dmg 2>/dev/null
    else
        echo -e "${RED}✗ macOS build failed (this is normal on Linux - use macOS for proper DMG builds)${NC}"
    fi
    echo ""
fi

# Build Linux package
if [ "$BUILD_LINUX" == true ]; then
    echo -e "${GOLD}Building Linux packages...${NC}"
    npx electron-builder --linux --x64
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Linux packages created!${NC}"
        ls -la dist/*.AppImage 2>/dev/null
        ls -la dist/*.deb 2>/dev/null
        ls -la dist/*.tar.gz 2>/dev/null
    else
        echo -e "${RED}✗ Linux build failed!${NC}"
    fi
    echo ""
fi

echo "=============================================="
echo -e "${GREEN}BUILD COMPLETE!${NC}"
echo "=============================================="
echo ""
echo "Installer files are in the 'dist' directory:"
ls -la dist/ 2>/dev/null
echo ""
echo -e "${GOLD}Thank you for using GOAT Royalty App!${NC}"