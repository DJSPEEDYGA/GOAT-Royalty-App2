#!/bin/bash

#######################################################
# SUPER GOAT ROYALTIES APP - Linux Package Builder
# Creates .deb, .rpm, .AppImage, and .tar.gz packages
#######################################################

set -e

APP_NAME="SUPER GOAT ROYALTIES APP"
APP_NAME_LOWER="super-goat-royalties"
APP_VERSION="1.0.0"
BUILD_DIR="$(cd .. && pwd)"
ROOT_DIR="$(cd ../.. && pwd)"
OUTPUT_DIR="$BUILD_DIR/output"
RESOURCES_DIR="$BUILD_DIR/resources"

echo "═══════════════════════════════════════════════════════"
echo "  Building Linux Packages"
echo "═══════════════════════════════════════════════════════"

# Create output directory
mkdir -p "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR/linux"

# Check for required tools
echo "[*] Checking Linux build tools..."

# Tools array for checking
TOOLS=("fakeroot" "dpkg-deb" "rpmbuild" "alien")
for tool in "${TOOLS[@]}"; do
    if command -v $tool &> /dev/null; then
        echo "    ✓ $tool found"
    else
        echo "    ! $tool not found"
    fi
done

# Install missing tools if possible
if ! command -v fakeroot &> /dev/null; then
    echo "[*] Installing fakeroot..."
    sudo apt-get install -y fakeroot 2>/dev/null || true
fi

# ============================================
# 1. Create .deb Package (Debian/Ubuntu)
# ============================================
echo ""
echo "[*] Building DEB package..."

DEB_DIR="$OUTPUT_DIR/linux/deb"
DEB_APP_DIR="$DEB_DIR/opt/$APP_NAME_LOWER"
DEB_CTRL_DIR="$DEB_DIR/DEBIAN"

mkdir -p "$DEB_APP_DIR"
mkdir -p "$DEB_CTRL_DIR"
mkdir -p "$DEB_DIR/usr/share/applications"
mkdir -p "$DEB_DIR/usr/share/pixmaps"
mkdir -p "$DEB_DIR/usr/bin"

# Copy application files
echo "    Copying application files..."
cp -r "$ROOT_DIR/pages" "$DEB_APP_DIR/" 2>/dev/null || true
cp -r "$ROOT_DIR/components" "$DEB_APP_DIR/" 2>/dev/null || true
cp -r "$ROOT_DIR/public" "$DEB_APP_DIR/" 2>/dev/null || true
cp -r "$ROOT_DIR/styles" "$DEB_APP_DIR/" 2>/dev/null || true
cp -r "$ROOT_DIR/lib" "$DEB_APP_DIR/" 2>/dev/null || true
cp -r "$ROOT_DIR/.next" "$DEB_APP_DIR/" 2>/dev/null || true

# Self-healing system
if [ -d "$ROOT_DIR/lib/self-healing" ]; then
    echo "    Including self-healing system..."
    mkdir -p "$DEB_APP_DIR/lib/self-healing"
    cp -r "$ROOT_DIR/lib/self-healing"/* "$DEB_APP_DIR/lib/self-healing/"
fi

# Config files
cp "$ROOT_DIR/package.json" "$DEB_APP_DIR/" 2>/dev/null || true
cp "$ROOT_DIR/next.config.js" "$DEB_APP_DIR/" 2>/dev/null || true
cp "$ROOT_DIR/.env.local" "$DEB_APP_DIR/" 2>/dev/null || true

# Create server.js for Linux
cat > "$DEB_APP_DIR/server.js" << 'SERVER_JS'
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(\`> Ready on http://\${hostname}:\${port}\`);
    });
});
SERVER_JS

# Create startup script
cat > "$DEB_DIR/usr/bin/$APP_NAME_LOWER" << 'STARTUP'
#!/bin/bash
cd /opt/super-goat-royalties
node server.js &
xdg-open http://localhost:3000
wait
STARTUP
chmod +x "$DEB_DIR/usr/bin/$APP_NAME_LOWER"

# Create desktop entry
cat > "$DEB_DIR/usr/share/applications/$APP_NAME_LOWER.desktop" << DESKTOP
[Desktop Entry]
Version=1.0
Name=SUPER GOAT ROYALTIES APP
Comment=Music Royalty Management Platform
Exec=/usr/bin/$APP_NAME_LOWER
Icon=$APP_NAME_LOWER
Terminal=true
Type=Application
Categories=Audio;Music;AudioVideo;
StartupNotify=true
DESKTOP

# Copy icon
cp "$RESOURCES_DIR/icon.png" "$DEB_DIR/usr/share/pixmaps/$APP_NAME_LOWER.png" 2>/dev/null || true

# Create control file
cat > "$DEB_CTRL_DIR/control" << CONTROL
Package: $APP_NAME_LOWER
Version: $APP_VERSION
Section: sound
Priority: optional
Architecture: amd64
Depends: nodejs (>= 14), npm
Maintainer: GOAT Royalties <support@goatroyalties.com>
Description: SUPER GOAT ROYALTIES APP
 Music Royalty Management Platform with AI-powered
 features, self-healing infrastructure, and real-time
 royalty tracking. Includes 242 API endpoints, 6 AI engines,
 voice commands, and comprehensive dashboard.
CONTROL

# Create postinst script
cat > "$DEB_CTRL_DIR/postinst" << 'POSTINST'
#!/bin/bash
cd /opt/super-goat-royalties
npm install --production 2>/dev/null || true
chmod +x /usr/bin/super-goat-royalties
echo "SUPER GOAT ROYALTIES APP installed successfully!"
echo "Run 'super-goat-royalties' to start the application."
POSTINST
chmod +x "$DEB_CTRL_DIR/postinst"

# Create prerm script
cat > "$DEB_CTRL_DIR/prerm" << 'PRERM'
#!/bin/bash
pkill -f "node server.js" 2>/dev/null || true
PRERM
chmod +x "$DEB_CTRL_DIR/prerm"

# Build DEB package
echo "    Building DEB package..."
cd "$OUTPUT_DIR/linux"
fakeroot dpkg-deb --build deb "$APP_NAME_LOWER-$APP_VERSION-amd64.deb" 2>/dev/null || {
    echo "    Note: DEB build may have warnings"
}

# ============================================
# 2. Create .tar.gz Archive (Universal)
# ============================================
echo ""
echo "[*] Building TAR.GZ archive..."

TAR_DIR="$OUTPUT_DIR/linux/$APP_NAME_LOWER-$APP_VERSION"
mkdir -p "$TAR_DIR"

# Copy files
cp -r "$DEB_APP_DIR"/* "$TAR_DIR/" 2>/dev/null || true

# Create startup script
cat > "$TAR_DIR/start.sh" << 'START_SH'
#!/bin/bash
cd "$(dirname "$0")"
npm install --production 2>/dev/null || true
node server.js &
BROWSER_PID=$!
xdg-open http://localhost:3000 2>/dev/null || open http://localhost:3000 2>/dev/null || echo "Open http://localhost:3000 in your browser"
wait $BROWSER_PID
START_SH
chmod +x "$TAR_DIR/start.sh"

# Create README
cat > "$TAR_DIR/README.txt" << 'README'
SUPER GOAT ROYALTIES APP v1.0.0
==============================

INSTALLATION:
1. Extract this archive
2. Open terminal in extracted folder
3. Run: ./start.sh
4. Open http://localhost:3000 in your browser

REQUIREMENTS:
- Node.js 14 or higher
- npm

FEATURES:
- Music Royalty Management
- AI-Powered Content Creation
- Self-Healing Infrastructure
- 242 API Endpoints
- 6 AI Engines
- Voice Commands
- Real-time Dashboard

For support: support@goatroyalties.com
README

# Create tarball
cd "$OUTPUT_DIR/linux"
tar -czf "$APP_NAME_LOWER-$APP_VERSION-linux.tar.gz" "$APP_NAME_LOWER-$APP_VERSION"

# ============================================
# 3. Create AppImage (Universal Linux)
# ============================================
echo ""
echo "[*] Building AppImage..."

APPIMAGE_DIR="$OUTPUT_DIR/linux/AppImage"
APPDIR="$APPIMAGE_DIR/$APP_NAME_LOWER.AppDir"

mkdir -p "$APPDIR/usr/bin"
mkdir -p "$APPDIR/usr/lib"
mkdir -p "$APPDIR/usr/share/applications"
mkdir -p "$APPDIR/usr/share/icons/hicolor/512x512/apps"

# Copy application
cp -r "$TAR_DIR"/* "$APPDIR/usr/lib/$APP_NAME_LOWER/" 2>/dev/null || true
mkdir -p "$APPDIR/usr/lib/$APP_NAME_LOWER"
cp -r "$TAR_DIR"/* "$APPDIR/usr/lib/$APP_NAME_LOWER/" 2>/dev/null || true

# AppImage desktop file
cat > "$APPDIR/usr/share/applications/$APP_NAME_LOWER.desktop" << 'DESKTOP'
[Desktop Entry]
Version=1.0
Name=SUPER GOAT ROYALTIES APP
Comment=Music Royalty Management Platform
Exec=super-goat-royalties
Icon=super-goat-royalties
Terminal=true
Type=Application
Categories=Audio;Music;AudioVideo;
DESKTOP

# AppRun script
cat > "$APPDIR/AppRun" << 'APPRUN'
#!/bin/bash
SELF=$(readlink -f "$0")
HERE=${SELF%/*}
cd "$HERE/usr/lib/super-goat-royalties"
node server.js &
SERVER_PID=$!
sleep 3
xdg-open http://localhost:3000 2>/dev/null || firefox http://localhost:3000 2>/dev/null &
wait $SERVER_PID
APPRUN
chmod +x "$APPDIR/AppRun"

# Copy icon
cp "$RESOURCES_DIR/icon.png" "$APPDIR/usr/share/icons/hicolor/512x512/apps/$APP_NAME_LOWER.png" 2>/dev/null || true
cp "$RESOURCES_DIR/icon.png" "$APPDIR/$APP_NAME_LOWER.png" 2>/dev/null || true

# Create symlinks
ln -s "usr/share/applications/$APP_NAME_LOWER.desktop" "$APPDIR/$APP_NAME_LOWER.desktop" 2>/dev/null || true
ln -s "usr/share/icons/hicolor/512x512/apps/$APP_NAME_LOWER.png" "$APPDIR/$APP_NAME_LOWER.png" 2>/dev/null || true

# Build AppImage
if command -v appimagetool &> /dev/null; then
    ARCH=x86_64 appimagetool "$APPDIR" "$OUTPUT_DIR/$APP_NAME_LOWER-$APP_VERSION-x86_64.AppImage" 2>/dev/null || true
else
    echo "    Note: appimagetool not found. Install from:"
    echo "    https://github.com/AppImage/AppImageKit/releases"
    echo "    Creating placeholder..."
    # Create a self-extracting archive as fallback
    makeself "$APPDIR" "$OUTPUT_DIR/$APP_NAME_LOWER-$APP_VERSION-x86_64.run" "$APP_NAME" ./AppRun 2>/dev/null || \
    echo "    Install 'makeself' for self-extracting archive"
fi

# ============================================
# 4. Create RPM Package (Red Hat/Fedora)
# ============================================
echo ""
echo "[*] Building RPM package..."

RPM_DIR="$OUTPUT_DIR/linux/rpm"
mkdir -p "$RPM_DIR"

if command -v rpmbuild &> /dev/null || command -v alien &> /dev/null; then
    # Use alien to convert DEB to RPM
    if command -v alien &> /dev/null; then
        echo "    Converting DEB to RPM using alien..."
        sudo alien -r --scripts "$OUTPUT_DIR/linux/$APP_NAME_LOWER-$APP_VERSION-amd64.deb" --target="$RPM_DIR/" 2>/dev/null || true
    fi
else
    echo "    Note: Install 'rpm' or 'alien' for RPM package support"
fi

# ============================================
# Summary
# ============================================
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  Linux Build Complete!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "Generated files:"
ls -lh "$OUTPUT_DIR/linux/"*.deb 2>/dev/null || true
ls -lh "$OUTPUT_DIR/linux/"*.tar.gz 2>/dev/null || true
ls -lh "$OUTPUT_DIR/linux/"*.rpm 2>/dev/null || true
ls -lh "$OUTPUT_DIR/"*.AppImage 2>/dev/null || true
echo ""
echo "Package installation commands:"
echo ""
echo "  DEB (Ubuntu/Debian):"
echo "    sudo dpkg -i $APP_NAME_LOWER-$APP_VERSION-amd64.deb"
echo ""
echo "  TAR.GZ (All Linux):"
echo "    tar -xzf $APP_NAME_LOWER-$APP_VERSION-linux.tar.gz"
echo "    cd $APP_NAME_LOWER-$APP_VERSION && ./start.sh"
echo ""
echo "  AppImage (All Linux):"
echo "    chmod +x $APP_NAME_LOWER-$APP_VERSION-x86_64.AppImage"
echo "    ./$APP_NAME_LOWER-$APP_VERSION-x86_64.AppImage"
echo ""

exit 0