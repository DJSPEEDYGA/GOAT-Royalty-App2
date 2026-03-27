#!/bin/bash

# ==============================================================================
# SUPER GOAT ROYALTIES APP - Quick Build Script
# Builds all installers in one command
# ==============================================================================

set -e

echo "=================================================="
echo "  SUPER GOAT ROYALTIES APP - Quick Build"
echo "=================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${BLUE}Step 1/5: Installing dependencies...${NC}"
npm install --silent

echo -e "${BLUE}Step 2/5: Building Next.js application...${NC}"
npm run build

echo -e "${BLUE}Step 3/5: Building Windows installer...${NC}"
npx electron-builder --win --x64 --config.win.sign=null 2>/dev/null || echo "Windows build may be incomplete"

echo -e "${BLUE}Step 4/5: Building Linux packages...${NC}"
npx electron-builder --linux appimage deb tar.gz --x64 2>/dev/null || echo "Linux build may be incomplete"

echo -e "${BLUE}Step 5/5: Creating portable version...${NC}"
chmod +x installer-build-system/build-portable.sh 2>/dev/null || true
./installer-build-system/build-portable.sh 2>/dev/null || echo "Portable build may be incomplete"

echo ""
echo -e "${GREEN}=================================================="
echo -e "  BUILD COMPLETE!"
echo -e "==================================================${NC}"
echo ""
echo "Output files:"
ls -la dist/ 2>/dev/null || echo "Check dist/ directory"
echo ""
ls -la portable-builds/portable/ 2>/dev/null || echo "Check portable-builds/ directory"

# Copy entitlements file
cp installer-build-system/../entitlements.mac.plist . 2>/dev/null || true

echo ""
echo -e "${YELLOW}Note: macOS DMG builds require a macOS machine${NC}"
echo -e "${YELLOW}For Windows builds on Linux, the installers will be unsigned${NC}"
echo ""
echo -e "To build specific platforms:"
echo -e "  Windows: ${BLUE}npm run build:win${NC}"
echo -e "  Linux:   ${BLUE}npm run electron:build:linux${NC}"
echo -e "  macOS:   ${BLUE}npm run electron:build:mac${NC} (on macOS only)"