#!/usr/bin/env bash
# ============================================================================
# Claude Code — macOS .dmg Creator
# ============================================================================
# This script creates a distributable .dmg disk image for Claude Code.
#
# Prerequisites:
#   - macOS with Xcode Command Line Tools
#   - create-dmg (brew install create-dmg) OR built-in hdiutil
#   - The Claude Code binary (or the installer script)
#
# Usage:
#   ./create-dmg.sh [--version VERSION]
#
# Output:
#   ../../build/ClaudeCode-VERSION-macos.dmg
# ============================================================================

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BUILD_DIR="$PROJECT_ROOT/build"
STAGING_DIR="$BUILD_DIR/dmg-staging"
APP_NAME="Claude Code"
BUNDLE_ID="com.anthropic.claude-code"
VERSION="${1:-2.0.0}"
DMG_NAME="ClaudeCode-${VERSION}-macos"
DMG_OUTPUT="$BUILD_DIR/${DMG_NAME}.dmg"
VOLUME_NAME="Claude Code Installer"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

log_info()  { echo -e "${CYAN}ℹ${RESET}  $*"; }
log_ok()    { echo -e "${GREEN}✔${RESET}  $*"; }
log_err()   { echo -e "${RED}✖${RESET}  $*" >&2; }
log_step()  { echo -e "\n${BOLD}▶ $*${RESET}"; }

# ============================================================================
# Parse arguments
# ============================================================================
while [[ $# -gt 0 ]]; do
    case "$1" in
        --version) VERSION="$2"; shift 2 ;;
        --help|-h)
            echo "Usage: $0 [--version VERSION]"
            echo "Creates a macOS .dmg installer for Claude Code."
            exit 0
            ;;
        *) shift ;;
    esac
done

# ============================================================================
# Pre-flight checks
# ============================================================================
log_step "Pre-flight checks"

if [[ "$(uname -s)" != "Darwin" ]]; then
    log_err "This script must be run on macOS."
    exit 1
fi

# Check for required tools
for tool in hdiutil; do
    if ! command -v "$tool" >/dev/null 2>&1; then
        log_err "Required tool not found: $tool"
        exit 1
    fi
done

HAS_CREATE_DMG=false
if command -v create-dmg >/dev/null 2>&1; then
    HAS_CREATE_DMG=true
    log_info "Using create-dmg for enhanced DMG creation"
else
    log_info "Using hdiutil (install create-dmg for prettier DMGs: brew install create-dmg)"
fi

log_ok "Pre-flight checks passed"

# ============================================================================
# Prepare staging directory
# ============================================================================
log_step "Preparing staging directory"

rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR"
mkdir -p "$BUILD_DIR"

# Create the .app bundle structure
APP_BUNDLE="$STAGING_DIR/${APP_NAME}.app"
mkdir -p "$APP_BUNDLE/Contents/MacOS"
mkdir -p "$APP_BUNDLE/Contents/Resources"

# ---- Info.plist ----
cat > "$APP_BUNDLE/Contents/Info.plist" << PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>${APP_NAME}</string>
    <key>CFBundleDisplayName</key>
    <string>${APP_NAME}</string>
    <key>CFBundleIdentifier</key>
    <string>${BUNDLE_ID}</string>
    <key>CFBundleVersion</key>
    <string>${VERSION}</string>
    <key>CFBundleShortVersionString</key>
    <string>${VERSION}</string>
    <key>CFBundleExecutable</key>
    <string>claude-launcher</string>
    <key>CFBundleIconFile</key>
    <string>claude</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleSignature</key>
    <string>????</string>
    <key>LSMinimumSystemVersion</key>
    <string>11.0</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>LSUIElement</key>
    <false/>
    <key>NSHumanReadableCopyright</key>
    <string>Copyright © Anthropic. All rights reserved.</string>
</dict>
</plist>
PLIST

# ---- Launcher script (inside .app bundle) ----
cat > "$APP_BUNDLE/Contents/MacOS/claude-launcher" << 'LAUNCHER'
#!/bin/bash
# Claude Code .app Launcher
# This script runs the installer if Claude isn't installed,
# or launches Claude Code if it is.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
RESOURCES_DIR="$SCRIPT_DIR/../Resources"

# Check if Claude is already installed
if command -v claude >/dev/null 2>&1; then
    # Open a terminal window with Claude
    if [[ -d "/Applications/iTerm.app" ]]; then
        osascript -e 'tell application "iTerm" to create window with default profile command "claude"'
    else
        osascript << 'EOF'
tell application "Terminal"
    activate
    do script "claude"
end tell
EOF
    fi
else
    # Run the installer
    osascript << EOF
tell application "Terminal"
    activate
    do script "bash '${RESOURCES_DIR}/install-claude.sh' && echo 'Press Enter to close...' && read"
end tell
EOF
fi
LAUNCHER
chmod +x "$APP_BUNDLE/Contents/MacOS/claude-launcher"

# ---- Copy installer script into Resources ----
cp "$PROJECT_ROOT/scripts/install-claude.sh" "$APP_BUNDLE/Contents/Resources/"
chmod +x "$APP_BUNDLE/Contents/Resources/install-claude.sh"

# ---- Copy icon if available ----
if [[ -f "$PROJECT_ROOT/assets/claude-icon.icns" ]]; then
    cp "$PROJECT_ROOT/assets/claude-icon.icns" "$APP_BUNDLE/Contents/Resources/claude.icns"
    log_ok "Icon copied"
else
    log_info "No .icns icon found at assets/claude-icon.icns (DMG will use default icon)"
fi

# ---- Create a README in the DMG ----
cat > "$STAGING_DIR/README.txt" << 'README'
╔══════════════════════════════════════════════════════════════════════════╗
║                          Claude Code                                    ║
║                    AI-Powered Coding Assistant                           ║
╚══════════════════════════════════════════════════════════════════════════╝

INSTALLATION:
  1. Drag "Claude Code.app" to your Applications folder
  2. Double-click to launch — it will install the CLI automatically
  3. Open Terminal and type: claude

ALTERNATIVE (Terminal-only install):
  Right-click "Claude Code.app" → Show Package Contents →
  Contents → Resources → install-claude.sh
  Run it in Terminal: bash install-claude.sh

REQUIREMENTS:
  • macOS 11.0 (Big Sur) or later
  • Intel or Apple Silicon Mac

MORE INFO:
  https://code.claude.com/docs

README

# ---- Create a symlink to /Applications for drag-and-drop ----
ln -sf /Applications "$STAGING_DIR/Applications"

log_ok "Staging directory prepared"

# ============================================================================
# Create DMG
# ============================================================================
log_step "Creating DMG"

# Remove old DMG if exists
rm -f "$DMG_OUTPUT"

if [[ "$HAS_CREATE_DMG" == "true" ]]; then
    # Use create-dmg for a polished DMG with background, icon positioning, etc.
    create-dmg \
        --volname "$VOLUME_NAME" \
        --volicon "$PROJECT_ROOT/assets/claude-icon.icns" 2>/dev/null \
        --window-pos 200 120 \
        --window-size 660 400 \
        --icon-size 80 \
        --icon "${APP_NAME}.app" 180 200 \
        --icon "Applications" 480 200 \
        --icon "README.txt" 330 340 \
        --hide-extension "${APP_NAME}.app" \
        --app-drop-link 480 200 \
        --no-internet-enable \
        "$DMG_OUTPUT" \
        "$STAGING_DIR" \
        || {
            log_info "create-dmg had warnings, falling back to hdiutil..."
            HAS_CREATE_DMG=false
        }
fi

if [[ "$HAS_CREATE_DMG" != "true" ]]; then
    # Fallback: use hdiutil directly
    log_info "Creating DMG with hdiutil..."

    # Create a temporary DMG (read-write)
    TEMP_DMG="$BUILD_DIR/temp-${DMG_NAME}.dmg"
    hdiutil create \
        -srcfolder "$STAGING_DIR" \
        -volname "$VOLUME_NAME" \
        -fs HFS+ \
        -fsargs "-c c=64,a=16,e=16" \
        -format UDRW \
        -size 200m \
        "$TEMP_DMG"

    # Mount it
    MOUNT_DIR=$(hdiutil attach -readwrite -noverify -noautoopen "$TEMP_DMG" | grep -oE '/Volumes/[^\n]+' | head -1)

    if [[ -n "$MOUNT_DIR" ]]; then
        # Set Finder window properties via AppleScript
        osascript << EOF
tell application "Finder"
    tell disk "$VOLUME_NAME"
        open
        set current view of container window to icon view
        set toolbar visible of container window to false
        set statusbar visible of container window to false
        set bounds of container window to {200, 120, 860, 520}
        set viewOptions to the icon view options of container window
        set arrangement of viewOptions to not arranged
        set icon size of viewOptions to 80
        close
    end tell
end tell
EOF
        # Unmount
        hdiutil detach "$MOUNT_DIR" -quiet || true
    fi

    # Convert to compressed read-only DMG
    hdiutil convert "$TEMP_DMG" \
        -format UDZO \
        -imagekey zlib-level=9 \
        -o "$DMG_OUTPUT"

    rm -f "$TEMP_DMG"
fi

# ============================================================================
# Cleanup & Summary
# ============================================================================
log_step "Cleanup"
rm -rf "$STAGING_DIR"
log_ok "Staging directory removed"

# Get DMG size
DMG_SIZE=$(du -h "$DMG_OUTPUT" | cut -f1)

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${GREEN}  ✅ DMG created successfully!${RESET}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""
echo -e "  ${BOLD}Output:${RESET}   $DMG_OUTPUT"
echo -e "  ${BOLD}Size:${RESET}     $DMG_SIZE"
echo -e "  ${BOLD}Version:${RESET}  $VERSION"
echo ""

# Verify DMG
log_info "Verifying DMG integrity..."
if hdiutil verify "$DMG_OUTPUT" >/dev/null 2>&1; then
    log_ok "DMG verification passed"
else
    log_err "DMG verification failed!"
    exit 1
fi

echo ""
echo -e "  ${BOLD}Next steps:${RESET}"
echo -e "    • Test: ${CYAN}open $DMG_OUTPUT${RESET}"
echo -e "    • For distribution, consider code-signing with:"
echo -e "      ${CYAN}codesign --deep --force --sign "Developer ID" "${APP_BUNDLE}"${RESET}"
echo -e "    • Then notarize with:"
echo -e "      ${CYAN}xcrun notarytool submit $DMG_OUTPUT --apple-id YOUR_ID --team-id TEAM${RESET}"
echo ""