#!/bin/bash

# ==============================================================================
# SUPER GOAT ROYALTIES APP - Portable Build Script
# Creates a cross-platform portable version that requires no installation
# ==============================================================================

set -e

APP_NAME="SUPER GOAT ROYALTIES APP"
PACKAGE_NAME="super-goat-royalties-app"
VERSION="1.0.0"
BUILD_DIR="./portable-builds"
PORTABLE_DIR="$BUILD_DIR/portable/$PACKAGE_NAME-portable"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=================================================="
echo -e "  $APP_NAME"
echo -e "  Portable Build Creator"
echo -e "==================================================${NC}"

# Clean previous builds
clean_previous() {
    echo -e "${YELLOW}Cleaning previous portable builds...${NC}"
    rm -rf "$PORTABLE_DIR"
    mkdir -p "$PORTABLE_DIR/app"
    mkdir -p "$PORTABLE_DIR/data"
    echo -e "${GREEN}✓ Clean complete${NC}"
}

# Copy application files
copy_app_files() {
    echo -e "${YELLOW}Copying application files...${NC}"
    
    # Copy built Next.js application
    if [ -d ".next" ]; then
        cp -r .next "$PORTABLE_DIR/app/"
        echo -e "${GREEN}  ✓ .next directory copied${NC}"
    else
        echo -e "${RED}  ✗ .next directory not found. Run 'npm run build' first.${NC}"
        exit 1
    fi
    
    # Copy public assets
    cp -r public "$PORTABLE_DIR/app/" 2>/dev/null || echo "  No public directory"
    
    # Copy source directories
    cp -r pages "$PORTABLE_DIR/app/" 2>/dev/null || echo "  No pages directory"
    cp -r components "$PORTABLE_DIR/app/" 2>/dev/null || echo "  No components directory"
    cp -r lib "$PORTABLE_DIR/app/" 2>/dev/null || echo "  No lib directory"
    cp -r styles "$PORTABLE_DIR/app/" 2>/dev/null || echo "  No styles directory"
    
    # Copy configuration files
    cp main.js preload.js start-server.js next.config.js package.json "$PORTABLE_DIR/app/" 2>/dev/null
    
    # Copy production dependencies
    echo -e "${YELLOW}Copying production dependencies...${NC}"
    if [ -d "node_modules" ]; then
        cp -r node_modules "$PORTABLE_DIR/app/"
        echo -e "${GREEN}  ✓ Dependencies copied${NC}"
    else
        echo -e "${RED}  ✗ node_modules not found. Run 'npm install' first.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Application files copied${NC}"
}

# Create Windows launcher
create_windows_launcher() {
    echo -e "${YELLOW}Creating Windows launcher...${NC}"
    
    cat > "$PORTABLE_DIR/START-WINDOWS.bat" << 'EOF'
@echo off
title SUPER GOAT ROYALTIES APP
color 0A
echo.
echo ================================================================
echo    ____  _____   ____                     _   _    _   _    _   
echo   / ___||  ___| |  _ \  ___  _ __   ___  | | | |  | \ | |  / \  
echo   \___ \|___ \  | | | |/ _ \| '_ \ / _ \ | |_| |  |  \| | / _ \ 
echo    ___) |___) | | |_| | (_) | | | |  __/ |  _  |  | |\  |/ ___ \
echo   |____/|____/  |____/ \___/|_| |_|\___| |_| |_|  |_| \_/_/   \_\
echo.
echo   R O Y A L T I E S   A P P
echo   ===============================
echo   Music Royalty Management Platform
echo   Version: 1.0.0
echo ================================================================
echo.
echo Starting application...
echo.

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Navigate to app directory
cd /d "%~dp0app"

REM Start the server
echo Starting server on http://localhost:3000...
start "" http://localhost:3000
node start-server.js

pause
EOF

    # Create silent launcher
    cat > "$PORTABLE_DIR/START-WINDOWS-SILENT.bat" << 'EOF'
@echo off
cd /d "%~dp0app"
start "" http://localhost:3000
start /b node start-server.js
EOF

    echo -e "${GREEN}  ✓ Windows launcher created${NC}"
}

# Create macOS launcher
create_macos_launcher() {
    echo -e "${YELLOW}Creating macOS launcher...${NC}"
    
    cat > "$PORTABLE_DIR/start-macos.sh" << 'EOF'
#!/bin/bash

# SUPER GOAT ROYALTIES APP - macOS Launcher

clear
echo ""
echo "================================================================"
echo "   SUPER GOAT ROYALTIES APP"
echo "   Music Royalty Management Platform"
echo "   Version: 1.0.0"
echo "================================================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed."
    echo "Please install Node.js 18+ from https://nodejs.org/"
    read -p "Press Enter to exit..."
    exit 1
fi

# Navigate to app directory
cd "$(dirname "$0")/app"

# Start the server
echo "Starting server on http://localhost:3000..."
open "http://localhost:3000"
node start-server.js
EOF

    chmod +x "$PORTABLE_DIR/start-macos.sh"
    echo -e "${GREEN}  ✓ macOS launcher created${NC}"
}

# Create Linux launcher
create_linux_launcher() {
    echo -e "${YELLOW}Creating Linux launcher...${NC}"
    
    cat > "$PORTABLE_DIR/start-linux.sh" << 'EOF'
#!/bin/bash

# SUPER GOAT ROYALTIES APP - Linux Launcher

clear
echo ""
echo "================================================================"
echo "   SUPER GOAT ROYALTIES APP"
echo "   Music Royalty Management Platform"
echo "   Version: 1.0.0"
echo "================================================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed."
    echo "Please install Node.js 18+ from https://nodejs.org/"
    read -p "Press Enter to exit..."
    exit 1
fi

# Navigate to app directory
cd "$(dirname "$0")/app"

# Start the server
echo "Starting server on http://localhost:3000..."

# Try different browsers
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:3000" &
elif command -v gnome-open &> /dev/null; then
    gnome-open "http://localhost:3000" &
elif command -v firefox &> /dev/null; then
    firefox "http://localhost:3000" &
fi

node start-server.js
EOF

    chmod +x "$PORTABLE_DIR/start-linux.sh"
    echo -e "${GREEN}  ✓ Linux launcher created${NC}"
}

# Create README file
create_readme() {
    echo -e "${YELLOW}Creating README...${NC}"
    
    cat > "$PORTABLE_DIR/README.txt" << 'EOF'
================================================================================
                     SUPER GOAT ROYALTIES APP
                   Music Royalty Management Platform
                          Portable Edition
================================================================================

GETTING STARTED
---------------
This portable version requires NO installation. Simply extract and run!

REQUIREMENTS
------------
- Node.js 18+ must be installed on your computer
- Download from: https://nodejs.org/

HOW TO RUN
----------
Windows:
  Double-click: START-WINDOWS.bat
  
macOS:
  Open Terminal, navigate to this folder, run: ./start-macos.sh
  
Linux:
  Open Terminal, navigate to this folder, run: ./start-linux.sh

The application will automatically open in your web browser at:
http://localhost:3000

FEATURES
--------
- 242 API Endpoints
- 6 AI Engine Integrations
- Voice Commands
- Real-time Dashboard
- Music Royalty Tracking
- Distribution Management
- Analytics & Reporting

TROUBLESHOOTING
---------------
Q: Application won't start
A: Ensure Node.js 18+ is installed and in your PATH

Q: Port 3000 is already in use
A: Close any other applications using port 3000

Q: Browser doesn't open automatically
A: Manually open http://localhost:3000 in your browser

SUPPORT
-------
Email: info@goatroyaltyapp.com
Website: https://goatroyaltyapp.com

LICENSE
-------
Copyright (c) 2024 GOAT Royalty Team
All Rights Reserved.

================================================================================
EOF

    echo -e "${GREEN}  ✓ README created${NC}"
}

# Create data directory structure
create_data_structure() {
    echo -e "${YELLOW}Creating data directory structure...${NC}"
    
    mkdir -p "$PORTABLE_DIR/data/logs"
    mkdir -p "$PORTABLE_DIR/data/cache"
    mkdir -p "$PORTABLE_DIR/data/config"
    
    # Create config template
    cat > "$PORTABLE_DIR/data/config/.env.template" << 'EOF'
# GOAT Royalty App Configuration
# Copy this file to .env and fill in your values

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# API Keys (add your keys below)
# SPOTIFY_CLIENT_ID=
# SPOTIFY_CLIENT_SECRET=
# TIKTOK_CLIENT_ID=
# TIKTOK_CLIENT_SECRET=
EOF

    echo -e "${GREEN}  ✓ Data structure created${NC}"
}

# Create compressed archives
create_archives() {
    echo -e "${YELLOW}Creating compressed archives...${NC}"
    
    cd "$BUILD_DIR/portable"
    
    # Create ZIP for Windows users
    echo "  Creating ZIP archive for Windows..."
    zip -r "$PACKAGE_NAME-portable-windows.zip" "$PACKAGE_NAME-portable" -x "*.DS_Store" -x "*__MACOSX*"
    
    # Create TAR.GZ for Linux/macOS users
    echo "  Creating TAR.GZ archive for Linux/macOS..."
    tar -czvf "$PACKAGE_NAME-portable-unix.tar.gz" "$PACKAGE_NAME-portable"
    
    # Get file sizes
    WIN_SIZE=$(du -h "$PACKAGE_NAME-portable-windows.zip" | cut -f1)
    UNIX_SIZE=$(du -h "$PACKAGE_NAME-portable-unix.tar.gz" | cut -f1)
    
    echo -e "${GREEN}✓ Archives created${NC}"
    echo ""
    echo -e "${GREEN}Output Files:${NC}"
    echo -e "  ${BLUE}$BUILD_DIR/portable/$PACKAGE_NAME-portable-windows.zip${NC} ($WIN_SIZE)"
    echo -e "  ${BLUE}$BUILD_DIR/portable/$PACKAGE_NAME-portable-unix.tar.gz${NC} ($UNIX_SIZE)"
}

# Calculate total size
show_summary() {
    echo ""
    echo -e "${GREEN}=================================================="
    echo -e "  PORTABLE BUILD COMPLETE!"
    echo -e "==================================================${NC}"
    echo ""
    
    TOTAL_SIZE=$(du -sh "$PORTABLE_DIR" | cut -f1)
    echo -e "Total portable size: ${BLUE}$TOTAL_SIZE${NC}"
    echo ""
    echo -e "Contents:"
    echo -e "  - Windows launcher: START-WINDOWS.bat"
    echo -e "  - macOS launcher: start-macos.sh"
    echo -e "  - Linux launcher: start-linux.sh"
    echo -e "  - Application files in: app/"
    echo -e "  - Data directory: data/"
    echo -e "  - README with instructions"
    echo ""
}

# Main execution
main() {
    clean_previous
    copy_app_files
    create_windows_launcher
    create_macos_launcher
    create_linux_launcher
    create_readme
    create_data_structure
    create_archives
    show_summary
}

main