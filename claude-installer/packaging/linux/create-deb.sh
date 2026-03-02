#!/usr/bin/env bash
# ============================================================================
# Claude Code — Debian/Ubuntu .deb Package Creator
# ============================================================================
# Creates a .deb package for Debian-based Linux distributions.
#
# Prerequisites:
#   - dpkg-deb (usually pre-installed on Debian/Ubuntu)
#   - fakeroot (optional, for proper file ownership)
#
# Usage:
#   ./create-deb.sh [--version VERSION] [--arch ARCH]
#
# Output:
#   ../../build/claude-code_VERSION_ARCH.deb
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BUILD_DIR="$PROJECT_ROOT/build"
VERSION="2.0.0"
ARCH="amd64"  # amd64 or arm64

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
BOLD='\033[1m'
RESET='\033[0m'

log_info()  { echo -e "${CYAN}ℹ${RESET}  $*"; }
log_ok()    { echo -e "${GREEN}✔${RESET}  $*"; }
log_err()   { echo -e "${RED}✖${RESET}  $*" >&2; }
log_step()  { echo -e "\n${BOLD}▶ $*${RESET}"; }

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --version) VERSION="$2"; shift 2 ;;
        --arch)    ARCH="$2"; shift 2 ;;
        --help|-h)
            echo "Usage: $0 [--version VERSION] [--arch amd64|arm64]"
            exit 0
            ;;
        *) shift ;;
    esac
done

GCS_BUCKET="https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases"
PKG_NAME="claude-code"
DEB_FILE="$BUILD_DIR/${PKG_NAME}_${VERSION}_${ARCH}.deb"

# Map arch to platform string
case "$ARCH" in
    amd64) PLATFORM="linux-x64" ;;
    arm64) PLATFORM="linux-arm64" ;;
    *) log_err "Unsupported architecture: $ARCH"; exit 1 ;;
esac

# Detect downloader
if command -v curl >/dev/null 2>&1; then
    dl() { curl -fsSL ${2:+-o "$2"} "$1"; }
elif command -v wget >/dev/null 2>&1; then
    dl() { wget -q ${2:+-O "$2"} ${2:--O -} "$1"; }
else
    log_err "curl or wget is required"; exit 1
fi

# ============================================================================
# Build
# ============================================================================
log_step "Building .deb package for ${ARCH}"

mkdir -p "$BUILD_DIR"

# Resolve version
log_info "Resolving version..."
RESOLVED_VERSION=$(dl "$GCS_BUCKET/latest" 2>/dev/null || echo "$VERSION")
RESOLVED_VERSION=$(echo "$RESOLVED_VERSION" | tr -d '[:space:]')
log_ok "Version: $RESOLVED_VERSION"

# Create package structure
STAGING="$BUILD_DIR/deb-staging"
rm -rf "$STAGING"
mkdir -p "$STAGING/DEBIAN"
mkdir -p "$STAGING/usr/local/bin"
mkdir -p "$STAGING/usr/share/doc/${PKG_NAME}"
mkdir -p "$STAGING/usr/share/man/man1"

# Download binary
log_info "Downloading binary..."
BINARY_PATH="$STAGING/usr/local/bin/claude"
if ! dl "$GCS_BUCKET/$RESOLVED_VERSION/$PLATFORM/claude" "$BINARY_PATH"; then
    log_err "Failed to download binary for $PLATFORM"
    exit 1
fi
chmod 755 "$BINARY_PATH"
log_ok "Binary downloaded ($(wc -c < "$BINARY_PATH" | tr -d ' ') bytes)"

# Verify checksum
log_info "Verifying checksum..."
MANIFEST=$(dl "$GCS_BUCKET/$RESOLVED_VERSION/manifest.json" 2>/dev/null || echo "")
if [[ -n "$MANIFEST" ]] && command -v jq >/dev/null 2>&1; then
    EXPECTED=$(echo "$MANIFEST" | jq -r --arg p "$PLATFORM" '.platforms[$p].checksum // empty')
    if [[ -n "$EXPECTED" ]]; then
        ACTUAL=$(sha256sum "$BINARY_PATH" | cut -d' ' -f1)
        if [[ "$ACTUAL" == "$EXPECTED" ]]; then
            log_ok "Checksum verified"
        else
            log_err "Checksum mismatch!"
            rm -rf "$STAGING"
            exit 1
        fi
    fi
fi

# Calculate installed size (in KB)
INSTALLED_SIZE=$(du -sk "$STAGING" | cut -f1)

# Create DEBIAN/control
cat > "$STAGING/DEBIAN/control" << CONTROL
Package: ${PKG_NAME}
Version: ${RESOLVED_VERSION}
Section: devel
Priority: optional
Architecture: ${ARCH}
Installed-Size: ${INSTALLED_SIZE}
Maintainer: Anthropic <support@anthropic.com>
Homepage: https://code.claude.com
Description: Claude Code — AI-Powered Coding Assistant
 Claude Code is an AI-powered coding assistant that runs in your terminal.
 It can help you write, debug, and understand code using natural language.
 .
 Features:
  - Natural language code generation
  - Code explanation and debugging
  - Shell command assistance
  - Project-aware context
CONTROL

# Create DEBIAN/postinst
cat > "$STAGING/DEBIAN/postinst" << 'POSTINST'
#!/bin/bash
set -e

# Run Claude's own setup if available
if [ -x /usr/local/bin/claude ]; then
    echo "Running Claude Code setup..."
    /usr/local/bin/claude install 2>/dev/null || true
fi

echo ""
echo "✅ Claude Code installed successfully!"
echo "   Run 'claude' to get started."
echo ""
POSTINST
chmod 755 "$STAGING/DEBIAN/postinst"

# Create DEBIAN/prerm
cat > "$STAGING/DEBIAN/prerm" << 'PRERM'
#!/bin/bash
set -e
# Cleanup before removal
if [ -x /usr/local/bin/claude ]; then
    /usr/local/bin/claude uninstall 2>/dev/null || true
fi
PRERM
chmod 755 "$STAGING/DEBIAN/prerm"

# Create copyright file
cat > "$STAGING/usr/share/doc/${PKG_NAME}/copyright" << COPYRIGHT
Format: https://www.debian.org/doc/packaging-manuals/copyright-format/1.0/
Upstream-Name: Claude Code
Upstream-Contact: Anthropic <support@anthropic.com>
Source: https://code.claude.com

Files: *
Copyright: Copyright (c) Anthropic
License: Proprietary
 See https://code.claude.com/terms for license terms.
COPYRIGHT

# Create changelog
cat > "$STAGING/usr/share/doc/${PKG_NAME}/changelog.Debian" << CHANGELOG
${PKG_NAME} (${RESOLVED_VERSION}) stable; urgency=medium

  * Release version ${RESOLVED_VERSION}

 -- Anthropic <support@anthropic.com>  $(date -R)
CHANGELOG
gzip -9 "$STAGING/usr/share/doc/${PKG_NAME}/changelog.Debian"

# Copy installer script as documentation
cp "$PROJECT_ROOT/scripts/install-claude.sh" "$STAGING/usr/share/doc/${PKG_NAME}/"

# Build the .deb
log_step "Building .deb package"
if command -v fakeroot >/dev/null 2>&1; then
    fakeroot dpkg-deb --build "$STAGING" "$DEB_FILE"
else
    dpkg-deb --build "$STAGING" "$DEB_FILE"
fi

# Cleanup
rm -rf "$STAGING"

# Summary
DEB_SIZE=$(du -h "$DEB_FILE" | cut -f1)
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${GREEN}  ✅ .deb package created successfully!${RESET}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""
echo -e "  ${BOLD}Output:${RESET}   $DEB_FILE"
echo -e "  ${BOLD}Size:${RESET}     $DEB_SIZE"
echo -e "  ${BOLD}Version:${RESET}  $RESOLVED_VERSION"
echo -e "  ${BOLD}Arch:${RESET}     $ARCH"
echo ""
echo -e "  ${BOLD}Install with:${RESET}"
echo -e "    ${CYAN}sudo dpkg -i $DEB_FILE${RESET}"
echo -e "    ${CYAN}sudo apt install ./$DEB_FILE${RESET}  (handles dependencies)"
echo ""

# Lint if lintian is available
if command -v lintian >/dev/null 2>&1; then
    log_info "Running lintian checks..."
    lintian "$DEB_FILE" 2>&1 || true
fi