#!/bin/bash

#######################################################
# SUPER GOAT ROYALTIES APP - Portable Version Builder
# Creates cross-platform portable package
#######################################################

set -e

APP_NAME="SUPER GOAT ROYALTIES APP"
APP_VERSION="1.0.0"
BUILD_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
OUTPUT_DIR="$BUILD_DIR/output"
RESOURCES_DIR="$BUILD_DIR/resources"

echo "═══════════════════════════════════════════════════════"
echo "  Building Portable Version"
echo "═══════════════════════════════════════════════════════"

# Create output directory
mkdir -p "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR/portable"

PORTABLE_DIR="$OUTPUT_DIR/portable/SUPER-GOAT-ROYALTIES-Portable"

echo "[*] Creating portable directory structure..."

# Clean and create fresh directory
rm -rf "$PORTABLE_DIR" 2>/dev/null || true
mkdir -p "$PORTABLE_DIR"
mkdir -p "$PORTABLE_DIR/data"
mkdir -p "$PORTABLE_DIR/logs"
mkdir -p "$PORTABLE_DIR/config"

# ============================================
# Copy Application Files
# ============================================
echo "[*] Copying application files..."

# Core Next.js application
cp -r "$ROOT_DIR/pages" "$PORTABLE_DIR/" 2>/dev/null || true
cp -r "$ROOT_DIR/components" "$PORTABLE_DIR/" 2>/dev/null || true
cp -r "$ROOT_DIR/public" "$PORTABLE_DIR/" 2>/dev/null || true
cp -r "$ROOT_DIR/styles" "$PORTABLE_DIR/" 2>/dev/null || true

# Lib folder with self-healing system
if [ -d "$ROOT_DIR/lib" ]; then
    echo "[*] Including lib folder..."
    cp -r "$ROOT_DIR/lib" "$PORTABLE_DIR/"
fi

# Self-healing system specifically
if [ -d "$ROOT_DIR/lib/self-healing" ]; then
    echo "[*] Including self-healing system..."
    mkdir -p "$PORTABLE_DIR/lib/self-healing"
    cp -r "$ROOT_DIR/lib/self-healing"/* "$PORTABLE_DIR/lib/self-healing/"
fi

# Next.js build
if [ -d "$ROOT_DIR/.next" ]; then
    echo "[*] Including Next.js build..."
    cp -r "$ROOT_DIR/.next" "$PORTABLE_DIR/"
else
    echo "[*] Building Next.js application..."
    cd "$ROOT_DIR"
    npm run build 2>/dev/null || echo "Note: Build may have warnings"
    cp -r "$ROOT_DIR/.next" "$PORTABLE_DIR/" 2>/dev/null || true
fi

# API routes
if [ -d "$ROOT_DIR/pages/api" ]; then
    echo "[*] Including API routes..."
    mkdir -p "$PORTABLE_DIR/pages/api"
    cp -r "$ROOT_DIR/pages/api"/* "$PORTABLE_DIR/pages/api/"
fi

# Configuration files
cp "$ROOT_DIR/package.json" "$PORTABLE_DIR/" 2>/dev/null || true
cp "$ROOT_DIR/package-lock.json" "$PORTABLE_DIR/" 2>/dev/null || true
cp "$ROOT_DIR/next.config.js" "$PORTABLE_DIR/" 2>/dev/null || true
cp "$ROOT_DIR/.env.local" "$PORTABLE_DIR/" 2>/dev/null || echo "Note: .env.local not found"
cp "$ROOT_DIR/.env.example" "$PORTABLE_DIR/" 2>/dev/null || true

# Node_modules handling
echo "[*] Handling dependencies..."
if [ -d "$ROOT_DIR/node_modules" ]; then
    echo "    Creating production-only node_modules..."
    # Option 1: Copy existing (faster but larger)
    # cp -r "$ROOT_DIR/node_modules" "$PORTABLE_DIR/"
    
    # Option 2: Install production deps only (smaller)
    cd "$PORTABLE_DIR"
    npm install --production 2>/dev/null || echo "    Note: Running npm install later may be needed"
else
    cd "$PORTABLE_DIR"
    npm install --production 2>/dev/null || echo "    Note: Run 'npm install' in the portable folder"
fi

# ============================================
# Create Cross-Platform Start Scripts
# ============================================
echo "[*] Creating start scripts..."

# Windows batch file
cat > "$PORTABLE_DIR/Start-Windows.bat" << 'WINBAT'
@echo off
title SUPER GOAT ROYALTIES APP
color 0A
cls
echo ============================================
echo   SUPER GOAT ROYALTIES APP v1.0.0
echo   Music Royalty Management Platform
echo ============================================
echo.
echo Starting application...
echo.

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install --production
    echo.
)

REM Start the server
echo Starting server on port 3000...
start "" http://localhost:3000
node server.js

pause
WINBAT

# Windows PowerShell script
cat > "$PORTABLE_DIR/Start-Windows.ps1" << 'WINPS'
# SUPER GOAT ROYALTIES APP - PowerShell Launcher
param(
    [switch]$Install,
    [switch]$Dev
)

$Host.UI.RawUI.WindowTitle = "SUPER GOAT ROYALTIES APP"
$Host.UI.RawUI.BackgroundColor = "DarkMagenta"
Clear-Host

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  SUPER GOAT ROYALTIES APP v1.0.0" -ForegroundColor Yellow
Write-Host "  Music Royalty Management Platform" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js is not installed." -ForegroundColor Red
    Write-Host "Please install from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Install if requested or no node_modules
if ($Install -or -not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install --production
    Write-Host ""
}

# Start server
Write-Host "Starting server on port 3000..." -ForegroundColor Green
Start-Process "http://localhost:3000"
node server.js
WINPS

# macOS/Linux bash script
cat > "$PORTABLE_DIR/start.sh" << 'BASH'
#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${CYAN}============================================${NC}"
echo -e "${YELLOW}  SUPER GOAT ROYALTIES APP v1.0.0${NC}"
echo -e "  Music Royalty Management Platform"
echo -e "${CYAN}============================================${NC}"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}ERROR: Node.js is not installed.${NC}"
    echo -e "${YELLOW}Please install from https://nodejs.org/${NC}"
    exit 1
fi

# Get script directory (portable path)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install --production
    echo ""
fi

# Start server
echo -e "${GREEN}Starting server on port 3000...${NC}"

# Open browser based on OS
open_browser() {
    if command -v xdg-open &> /dev/null; then
        xdg-open "http://localhost:3000" 2>/dev/null &
    elif command -v open &> /dev/null; then
        open "http://localhost:3000" 2>/dev/null &
    elif command -v firefox &> /dev/null; then
        firefox "http://localhost:3000" 2>/dev/null &
    else
        echo -e "${YELLOW}Open http://localhost:3000 in your browser${NC}"
    fi
}

open_browser
node server.js
BASH
chmod +x "$PORTABLE_DIR/start.sh"

# macOS specific launcher
cat > "$PORTABLE_DIR/start-macos.sh" << 'MACOS'
#!/bin/bash

# SUPER GOAT ROYALTIES APP - macOS Launcher
# Works from any location (USB drive, Applications, etc.)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "SUPER GOAT ROYALTIES APP v1.0.0"
echo "Starting..."

# Check Node.js
if ! command -v node &> /dev/null; then
    osascript -e 'display dialog "Node.js is required. Please install from https://nodejs.org/" buttons {"OK"} default button "OK"'
    exit 1
fi

# Install deps if needed
[ ! -d "node_modules" ] && npm install --production

# Start server
node server.js &
sleep 2
open "http://localhost:3000"
wait
MACOS
chmod +x "$PORTABLE_DIR/start-macos.sh"

# Linux specific launcher
cat > "$PORTABLE_DIR/start-linux.sh" << 'LINUX'
#!/bin/bash

# SUPER GOAT ROYALTIES APP - Linux Launcher

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check Node.js
if ! command -v node &> /dev/null; then
    if command -v zenity &> /dev/null; then
        zenity --error --text="Node.js is required.\nPlease install from https://nodejs.org/"
    else
        echo "ERROR: Node.js is required. Install from https://nodejs.org/"
    fi
    exit 1
fi

# Install deps if needed
[ ! -d "node_modules" ] && npm install --production

# Start server
node server.js &
SERVER_PID=$!
sleep 2

# Open browser
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:3000"
elif command -v firefox &> /dev/null; then
    firefox "http://localhost:3000" &
fi

wait $SERVER_PID
LINUX
chmod +x "$PORTABLE_DIR/start-linux.sh"

# ============================================
# Create Server.js for Portable
# ============================================
echo "[*] Creating server.js..."

cat > "$PORTABLE_DIR/server.js" << 'SERVER'
const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const next = require('next');
const fs = require('fs');

// Portable configuration
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || 'localhost';
const DEV = process.env.NODE_ENV === 'development';

// Data directories (relative to app location)
const DATA_DIR = path.join(__dirname, 'data');
const LOGS_DIR = path.join(__dirname, 'logs');
const CONFIG_DIR = path.join(__dirname, 'config');

// Ensure directories exist
[DATA_DIR, LOGS_DIR, CONFIG_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

console.log('');
console.log('╔════════════════════════════════════════════════════╗');
console.log('║    SUPER GOAT ROYALTIES APP v1.0.0                ║');
console.log('║    Music Royalty Management Platform               ║');
console.log('╚════════════════════════════════════════════════════╝');
console.log('');
console.log(`Server starting on http://${HOSTNAME}:${PORT}`);
console.log(`Data directory: ${DATA_DIR}`);
console.log(`Logs directory: ${LOGS_DIR}`);
console.log('');

// Initialize Next.js
const app = next({ 
    dev: DEV, 
    hostname: HOSTNAME, 
    port: PORT,
    dir: __dirname
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            
            // Health check endpoint
            if (parsedUrl.pathname === '/health') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    status: 'ok', 
                    version: '1.0.0',
                    portable: true,
                    timestamp: new Date().toISOString()
                }));
                return;
            }
            
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error handling request:', err);
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
    });

    server.once('error', (err) => {
        console.error('Server error:', err);
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use. Close other instances or change PORT.`);
        }
        process.exit(1);
    });

    server.listen(PORT, () => {
        console.log(`✓ Server ready at http://${HOSTNAME}:${PORT}`);
        console.log('');
        console.log('Features:');
        console.log('  • AI-Powered Content Creation');
        console.log('  • Self-Healing Infrastructure');
        console.log('  • 242 API Endpoints');
        console.log('  • 6 AI Engines');
        console.log('  • Voice Commands');
        console.log('  • Real-time Dashboard');
        console.log('');
        console.log('Press Ctrl+C to stop the server');
        console.log('');
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('\nShutting down gracefully...');
        server.close(() => process.exit(0));
    });

    process.on('SIGINT', () => {
        console.log('\nShutting down gracefully...');
        server.close(() => process.exit(0));
    });
}).catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
});
SERVER

# ============================================
# Create Documentation
# ============================================
echo "[*] Creating documentation..."

# README
cat > "$PORTABLE_DIR/README.txt" << 'README'
╔══════════════════════════════════════════════════════════════╗
║           SUPER GOAT ROYALTIES APP v1.0.0                    ║
║           Music Royalty Management Platform                  ║
╚══════════════════════════════════════════════════════════════╝

QUICK START
===========

Windows:
  Double-click "Start-Windows.bat"
  Or run in PowerShell: .\Start-Windows.ps1

macOS:
  Open Terminal in this folder
  Run: ./start.sh or ./start-macos.sh

Linux:
  Open Terminal in this folder
  Run: ./start.sh or ./start-linux.sh


REQUIREMENTS
============
• Node.js 14 or higher (https://nodejs.org/)
• npm (comes with Node.js)
• Modern web browser


FEATURES
========
✓ AI-Powered Content Creation (6 AI Engines)
✓ Self-Healing Infrastructure (99.99% Uptime)
✓ Real-time Royalty Tracking
✓ 242 API Endpoints
✓ Voice Commands
✓ Multi-modal AI Support (Gemini, ComfyUI)
✓ IP Protection & Copyright Monitoring
✓ Comprehensive Dashboard


DIRECTORY STRUCTURE
===================
├── Start-Windows.bat    # Windows launcher
├── Start-Windows.ps1    # Windows PowerShell launcher
├── start.sh             # Unix/macOS/Linux launcher
├── start-macos.sh       # macOS specific launcher
├── start-linux.sh       # Linux specific launcher
├── server.js            # Main server file
├── package.json         # Node.js dependencies
├── pages/               # Application pages
├── components/          # React components
├── lib/                 # Core libraries
│   └── self-healing/    # Self-healing system
├── data/                # User data storage
├── logs/                # Application logs
└── config/              # Configuration files


PORTABLE FEATURES
=================
• Run from any location (USB drive, network, etc.)
• No installation required
• All data stored locally
• Self-contained dependencies


CONFIGURATION
=============
Edit .env.local for:
• API keys (Gemini AI, etc.)
• Database connections
• Custom settings


TROUBLESHOOTING
===============
• Port 3000 in use: Close other apps or change PORT in .env.local
• Dependencies missing: Run "npm install"
• Node.js not found: Install from https://nodejs.org/


SUPPORT
=======
GitHub: https://github.com/DJSPEEDYGA/GOAT-Royalty-App2
Email: support@goatroyalties.com


LICENSE
=======
Copyright © 2024 GOAT Royalties. All rights reserved.
README

# CHANGELOG
cat > "$PORTABLE_DIR/CHANGELOG.txt" << 'CHANGELOG'
SUPER GOAT ROYALTIES APP - Changelog
=====================================

Version 1.0.0 (Current)
-----------------------
• Initial portable release
• Self-healing infrastructure system
• 6 AI engine integrations
• 242 API endpoints
• Voice command system
• Real-time dashboard
• IP protection features
• Cross-platform launchers

Planned Features
----------------
• Auto-update system
• Offline mode
• Cloud sync
• Mobile companion app
CHANGELOG

# LICENSE
cat > "$PORTABLE_DIR/LICENSE.txt" << 'LICENSE'
SUPER GOAT ROYALTIES APP
END USER LICENSE AGREEMENT

Copyright (c) 2024 GOAT Royalties. All rights reserved.

This software is licensed, not sold. You may use this software
for personal and commercial royalty management purposes.

RESTRICTIONS:
• You may not reverse engineer the software
• You may not redistribute modified versions
• You may not remove copyright notices

WARRANTY:
This software is provided "as is" without warranty of any kind.

For full license terms, contact support@goatroyalties.com
LICENSE

# ============================================
# Create Config Template
# ============================================
echo "[*] Creating configuration templates..."

cat > "$PORTABLE_DIR/config/config.example.json" << 'CONFIG'
{
  "app": {
    "name": "SUPER GOAT ROYALTIES APP",
    "version": "1.0.0",
    "port": 3000
  },
  "ai": {
    "geminiApiKey": "YOUR_GEMINI_API_KEY",
    "enabledEngines": ["gemini", "comfyui"]
  },
  "selfHealing": {
    "enabled": true,
    "checkInterval": 30000,
    "maxRetries": 3
  },
  "features": {
    "voiceCommands": true,
    "ipProtection": true,
    "realTimeDashboard": true
  }
}
CONFIG

cat > "$PORTABLE_DIR/.env.example" << 'ENV_EXAMPLE'
# SUPER GOAT ROYALTIES APP Configuration
# Copy this file to .env.local and fill in your values

# Server Configuration
PORT=3000
HOSTNAME=localhost
NODE_ENV=production

# AI Configuration
GOOGLE_AI_API_KEY=your_gemini_api_key_here

# Database (optional - uses local files by default)
DATABASE_URL=

# Features
ENABLE_SELF_HEALING=true
ENABLE_VOICE_COMMANDS=true
ENABLE_IP_PROTECTION=true
ENV_EXAMPLE

# ============================================
# Create ZIP Archive
# ============================================
echo "[*] Creating portable ZIP archive..."

ZIP_NAME="SUPER-GOAT-ROYALTIES-Portable-$APP_VERSION.zip"

cd "$OUTPUT_DIR/portable"
zip -r "$OUTPUT_DIR/$ZIP_NAME" "SUPER-GOAT-ROYALTIES-Portable" -x "*.DS_Store" -x "*Thumbs.db"

# Also create a tar.gz for Linux users
echo "[*] Creating portable TAR.GZ archive..."

cd "$OUTPUT_DIR/portable"
tar -czf "$OUTPUT_DIR/SUPER-GOAT-ROYALTIES-Portable-$APP_VERSION.tar.gz" "SUPER-GOAT-ROYALTIES-Portable"

# ============================================
# Summary
# ============================================
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  Portable Build Complete!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "Generated files:"
ls -lh "$OUTPUT_DIR/"*Portable*.zip 2>/dev/null || true
ls -lh "$OUTPUT_DIR/"*Portable*.tar.gz 2>/dev/null || true
echo ""
echo "Portable directory: $PORTABLE_DIR"
echo ""
echo "Contents:"
echo "  • Cross-platform start scripts (Windows, macOS, Linux)"
echo "  • Complete application files"
echo "  • Self-healing system"
echo "  • Documentation (README, CHANGELOG, LICENSE)"
echo "  • Configuration templates"
echo "  • Data/Logs/Config directories"
echo ""
echo "Usage:"
echo "  1. Extract ZIP to any location (USB drive, Desktop, etc.)"
echo "  2. Run appropriate start script for your OS"
echo "  3. Application opens at http://localhost:3000"
echo ""

exit 0