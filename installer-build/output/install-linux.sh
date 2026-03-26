#!/bin/bash
# SUPER GOAT ROYALTIES APP - Linux Installer Script
# This script installs the portable version on Linux

set -e

APP_NAME="SUPER GOAT ROYALTIES APP"
APP_VERSION="1.0.0"
INSTALL_DIR="/opt/super-goat-royalties"
DESKTOP_FILE="/usr/share/applications/super-goat-royalties.desktop"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "============================================"
echo "  $APP_NAME v$APP_VERSION Installer"
echo "============================================"
echo ""

# Check for root privileges
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}[INFO] Running without root privileges${NC}"
    echo "[INFO] Installing to user directory: ~/.local/share/super-goat-royalties"
    INSTALL_DIR="$HOME/.local/share/super-goat-royalties"
    DESKTOP_FILE="$HOME/.local/share/applications/super-goat-royalties.desktop"
fi

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Create installation directory
echo "[1/5] Creating installation directory..."
mkdir -p "$INSTALL_DIR"

# Copy application files
echo "[2/5] Copying application files..."
if [ -d "$SCRIPT_DIR/SUPER-GOAT-ROYALTIES-Portable" ]; then
    cp -r "$SCRIPT_DIR/SUPER-GOAT-ROYALTIES-Portable"/* "$INSTALL_DIR/"
else
    echo -e "${RED}[ERROR] Application files not found!${NC}"
    echo "Please ensure the SUPER-GOAT-ROYALTIES-Portable directory exists."
    exit 1
fi

# Make scripts executable
chmod +x "$INSTALL_DIR/start-linux.sh" 2>/dev/null || true
chmod +x "$INSTALL_DIR/start.sh" 2>/dev/null || true

# Create desktop entry
echo "[3/5] Creating desktop entry..."
mkdir -p "$(dirname "$DESKTOP_FILE")"
cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Version=1.0
Name=SUPER GOAT ROYALTIES APP
Comment=Music Royalty Management Platform
Exec=$INSTALL_DIR/start-linux.sh
Icon=$INSTALL_DIR/public/favicon.ico
Terminal=true
Type=Application
Categories=Audio;Music;Finance;
StartupNotify=true
EOF

# Create symbolic link in PATH (optional)
echo "[4/5] Creating symbolic link..."
if [ "$EUID" -eq 0 ]; then
    ln -sf "$INSTALL_DIR/start-linux.sh" /usr/local/bin/super-goat-royalties
else
    mkdir -p "$HOME/.local/bin"
    ln -sf "$INSTALL_DIR/start-linux.sh" "$HOME/.local/bin/super-goat-royalties"
fi

# Create uninstaller
echo "[5/5] Creating uninstaller..."
cat > "$INSTALL_DIR/uninstall.sh" << 'EOF'
#!/bin/bash
echo "Uninstalling SUPER GOAT ROYALTIES APP..."
rm -rf INSTALL_DIR_PLACEHOLDER
rm -f DESKTOP_FILE_PLACEHOLDER
rm -f /usr/local/bin/super-goat-royalties 2>/dev/null || true
rm -f "$HOME/.local/bin/super-goat-royalties" 2>/dev/null || true
echo "SUPER GOAT ROYALTIES APP has been uninstalled."
EOF
sed -i "s|INSTALL_DIR_PLACEHOLDER|$INSTALL_DIR|g" "$INSTALL_DIR/uninstall.sh"
sed -i "s|DESKTOP_FILE_PLACEHOLDER|$DESKTOP_FILE|g" "$INSTALL_DIR/uninstall.sh"
chmod +x "$INSTALL_DIR/uninstall.sh"

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Installation Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Installation directory: $INSTALL_DIR"
echo ""
echo "To start the application:"
echo "  - Run: $INSTALL_DIR/start-linux.sh"
echo "  - Or use the desktop menu entry"
echo "  - Or run: super-goat-royalties (if in PATH)"
echo ""
echo "To uninstall:"
echo "  - Run: $INSTALL_DIR/uninstall.sh"
echo ""