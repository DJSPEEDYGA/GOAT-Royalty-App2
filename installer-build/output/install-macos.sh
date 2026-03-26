#!/bin/bash
# SUPER GOAT ROYALTIES APP - macOS Installer Script
# This script installs the portable version on macOS

set -e

APP_NAME="SUPER GOAT ROYALTIES APP"
APP_VERSION="1.0.0"
APP_BUNDLE="SUPER GOAT ROYALTIES APP.app"
INSTALL_DIR="/Applications"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "============================================"
echo "  $APP_NAME v$APP_VERSION Installer"
echo "============================================"
echo ""

# Check for macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${YELLOW}[WARNING] This installer is designed for macOS${NC}"
    echo "For other systems, use the appropriate installer."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create .app bundle structure
echo "[1/4] Creating application bundle..."
APP_PATH="$INSTALL_DIR/$APP_BUNDLE"

# Remove existing installation if present
if [ -d "$APP_PATH" ]; then
    echo "[INFO] Removing existing installation..."
    rm -rf "$APP_PATH"
fi

mkdir -p "$APP_PATH/Contents/MacOS"
mkdir -p "$APP_PATH/Contents/Resources"
mkdir -p "$APP_PATH/Contents/Resources/app"

# Copy application files
echo "[2/4] Copying application files..."
if [ -d "$SCRIPT_DIR/SUPER-GOAT-ROYALTIES-Portable" ]; then
    cp -r "$SCRIPT_DIR/SUPER-GOAT-ROYALTIES-Portable"/* "$APP_PATH/Contents/Resources/app/"
else
    echo -e "${RED}[ERROR] Application files not found!${NC}"
    exit 1
fi

# Make scripts executable
chmod +x "$APP_PATH/Contents/Resources/app/start-macos.sh" 2>/dev/null || true
chmod +x "$APP_PATH/Contents/Resources/app/start.sh" 2>/dev/null || true

# Create Info.plist
echo "[3/4] Creating application metadata..."
cat > "$APP_PATH/Contents/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleExecutable</key>
    <string>launcher</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
    <key>CFBundleIdentifier</key>
    <string>com.goatroyalties.app</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$APP_NAME</string>
    <key>CFBundleDisplayName</key>
    <string>$APP_NAME</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>$APP_VERSION</string>
    <key>CFBundleVersion</key>
    <string>$APP_VERSION</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.13</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>NSRequiresAquaSystemAppearance</key>
    <false/>
</dict>
</plist>
EOF

# Create launcher script
cat > "$APP_PATH/Contents/MacOS/launcher" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/../Resources/app"
./start-macos.sh
EOF
chmod +x "$APP_PATH/Contents/MacOS/launcher"

# Create uninstaller
echo "[4/4] Creating uninstaller..."
cat > "$APP_PATH/Contents/Resources/uninstall.sh" << EOF
#!/bin/bash
echo "Uninstalling $APP_NAME..."
rm -rf "$APP_PATH"
echo "$APP_NAME has been uninstalled."
EOF
chmod +x "$APP_PATH/Contents/Resources/uninstall.sh"

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Installation Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Installation directory: $APP_PATH"
echo ""
echo "To start the application:"
echo "  - Open Spotlight (Cmd+Space) and search for 'SUPER GOAT ROYALTIES'"
echo "  - Or navigate to /Applications and double-click the app"
echo ""
echo "To uninstall:"
echo "  - Run: $APP_PATH/Contents/Resources/uninstall.sh"
echo "  - Or drag the app to Trash"
echo ""