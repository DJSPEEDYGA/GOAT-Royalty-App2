#!/bin/bash

# SUPER GOAT ROYALTIES APP - Portable Package Creator
# Creates a cross-platform portable version that runs without installation

set -e

APP_NAME="GOAT-Royalty-App"
VERSION="1.0.0"
DIST_DIR="dist/portable"
CLIENT_DIR="client"

echo "🐐 Creating Portable Package for SUPER GOAT ROYALTIES APP..."
echo ""

# Create distribution directory
rm -rf $DIST_DIR
mkdir -p $DIST_DIR/$APP_NAME-Portable

# Copy static build
echo "📦 Copying application files..."
cp -r $CLIENT_DIR/out/* $DIST_DIR/$APP_NAME-Portable/

# Create launcher scripts
echo "🚀 Creating launcher scripts..."

# Windows launcher
cat > $DIST_DIR/$APP_NAME-Portable/START-WINDOWS.bat << 'EOF'
@echo off
title SUPER GOAT ROYALTIES APP
echo.
echo 🐐 SUPER GOAT ROYALTIES APP - Portable Edition
echo ================================================
echo.
echo Starting application...
echo.
echo Open your browser and go to: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server.
echo.
cd /d "%~dp0"
python -m http.server 8080 --bind localhost
pause
EOF

# macOS/Linux launcher
cat > $DIST_DIR/$APP_NAME-Portable/start-unix.sh << 'EOF'
#!/bin/bash
echo ""
echo "🐐 SUPER GOAT ROYALTIES APP - Portable Edition"
echo "================================================"
echo ""
echo "Starting application..."
echo ""
echo "Open your browser and go to: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""
cd "$(dirname "$0")"
python3 -m http.server 8080 --bind localhost
EOF

chmod +x $DIST_DIR/$APP_NAME-Portable/start-unix.sh

# Create README
cat > $DIST_DIR/$APP_NAME-Portable/README.txt << 'EOF'
╔══════════════════════════════════════════════════════════════╗
║         🐐 SUPER GOAT ROYALTIES APP - Portable               ║
║              Music Royalty Management Platform                ║
╚══════════════════════════════════════════════════════════════╝

HOW TO RUN:
===========

Windows:
  Double-click START-WINDOWS.bat

macOS/Linux:
  Open terminal in this folder and run:
  chmod +x start-unix.sh
  ./start-unix.sh

Then open: http://localhost:8080

FEATURES:
=========
✅ AI-Powered Royalty Tracking
✅ 17+ AI Models Integrated
✅ Voice Commands
✅ Real-time Dashboard
✅ Waka's Rap Dictionary
✅ Ultimate Engine CoPilot Integration

REQUIREMENTS:
=============
- Python 3.x (for local server)
- Modern web browser (Chrome, Firefox, Safari, Edge)

SUPPORT:
========
GitHub: DJSPEEDYGA/GOAT-Royalty-App2
EOF

# Create version info
cat > $DIST_DIR/$APP_NAME-Portable/version.json << EOF
{
  "name": "SUPER GOAT ROYALTIES APP",
  "version": "$VERSION",
  "buildDate": "$(date -Iseconds)",
  "type": "portable"
}
EOF

# Create zip archive
echo "📦 Creating ZIP archive..."
cd $DIST_DIR
zip -r ${APP_NAME}-Portable-${VERSION}.zip $APP_NAME-Portable/
cd ../..

echo ""
echo "✅ Portable package created successfully!"
echo "📁 Location: $DIST_DIR/$APP_NAME-Portable/"
echo "📦 ZIP Archive: $DIST_DIR/${APP_NAME}-Portable-${VERSION}.zip"
echo ""