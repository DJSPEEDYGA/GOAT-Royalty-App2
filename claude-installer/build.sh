#!/usr/bin/env bash
# ============================================================================
# Claude Code — Master Build Script
# ============================================================================
# Orchestrates building all installer packages from a single command.
#
# Usage:
#   ./build.sh [OPTIONS]
#
# Options:
#   --all           Build all packages (default)
#   --macos         Build macOS .dmg only
#   --linux         Build Linux .deb only
#   --portable      Build portable archives only
#   --windows       Prepare Windows installer files only
#   --version VER   Override version string
#   --clean         Remove all build artifacts
#   --help          Show this help
#
# Requirements vary by target:
#   macOS .dmg:     macOS + Xcode CLI tools (+ optional: create-dmg)
#   Linux .deb:     dpkg-deb (+ optional: fakeroot, lintian)
#   Portable:       curl or wget, tar, gzip
#   Windows .exe:   NSIS 3.x (makensis) — typically built on Windows
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$SCRIPT_DIR/build"
VERSION="2.0.0"

# Build targets
BUILD_MACOS=0
BUILD_LINUX=0
BUILD_PORTABLE=0
BUILD_WINDOWS=0
BUILD_ALL=1
CLEAN=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

log_info()  { echo -e "${CYAN}ℹ${RESET}  $*"; }
log_ok()    { echo -e "${GREEN}✔${RESET}  $*"; }
log_warn()  { echo -e "${YELLOW}⚠${RESET}  $*"; }
log_err()   { echo -e "${RED}✖${RESET}  $*" >&2; }
log_step()  { echo -e "\n${BOLD}${CYAN}━━━ $* ━━━${RESET}"; }

# ============================================================================
# Parse arguments
# ============================================================================
while [[ $# -gt 0 ]]; do
    case "$1" in
        --all)       BUILD_ALL=1; shift ;;
        --macos)     BUILD_MACOS=1; BUILD_ALL=0; shift ;;
        --linux)     BUILD_LINUX=1; BUILD_ALL=0; shift ;;
        --portable)  BUILD_PORTABLE=1; BUILD_ALL=0; shift ;;
        --windows)   BUILD_WINDOWS=1; BUILD_ALL=0; shift ;;
        --version)   VERSION="$2"; shift 2 ;;
        --clean)     CLEAN=1; shift ;;
        --help|-h)
            sed -n '2,/^# ====/{ /^# ====/d; s/^# //; s/^#//; p; }' "$0"
            exit 0
            ;;
        *) log_err "Unknown option: $1"; exit 1 ;;
    esac
done

if [[ "$BUILD_ALL" == "1" ]]; then
    BUILD_MACOS=1
    BUILD_LINUX=1
    BUILD_PORTABLE=1
    BUILD_WINDOWS=1
fi

# ============================================================================
# Clean
# ============================================================================
if [[ "$CLEAN" == "1" ]]; then
    log_step "Cleaning build artifacts"
    rm -rf "$BUILD_DIR"
    log_ok "Build directory removed: $BUILD_DIR"
    exit 0
fi

# ============================================================================
# Banner
# ============================================================================
echo ""
echo -e "${BOLD}${CYAN}"
cat << 'BANNER'
   _____ _                 _         ____          _
  / ____| |               | |       / ___|___   __| | ___
 | |    | | __ _ _   _  __| | ___  | |   / _ \ / _` |/ _ \
 | |    | |/ _` | | | |/ _` |/ _ \ | |__| (_) | (_| |  __/
  \____|_|\__,_|\__,_|\__,_|\___/  \____\___/ \__,_|\___|
BANNER
echo -e "${RESET}"
echo -e "  ${BOLD}Package Builder${RESET} — v${VERSION}"
echo -e "  ${DIM}Building installer packages for distribution${RESET}"
echo ""

mkdir -p "$BUILD_DIR"

# Track results
declare -a RESULTS=()
TOTAL=0
PASSED=0
FAILED=0
SKIPPED=0

record_result() {
    local name="$1" status="$2" detail="${3:-}"
    TOTAL=$((TOTAL + 1))
    case "$status" in
        ok)      PASSED=$((PASSED + 1));  RESULTS+=("${GREEN}✔${RESET}  $name ${DIM}$detail${RESET}") ;;
        fail)    FAILED=$((FAILED + 1));  RESULTS+=("${RED}✖${RESET}  $name ${DIM}$detail${RESET}") ;;
        skip)    SKIPPED=$((SKIPPED + 1)); RESULTS+=("${YELLOW}⊘${RESET}  $name ${DIM}(skipped: $detail)${RESET}") ;;
    esac
}

# ============================================================================
# macOS .dmg
# ============================================================================
if [[ "$BUILD_MACOS" == "1" ]]; then
    log_step "macOS .dmg Installer"
    if [[ "$(uname -s)" == "Darwin" ]]; then
        if bash "$SCRIPT_DIR/packaging/macos/create-dmg.sh" --version "$VERSION"; then
            record_result "macOS .dmg" "ok" "$(ls -lh "$BUILD_DIR"/*macos*.dmg 2>/dev/null | awk '{print $5, $NF}' | head -1)"
        else
            record_result "macOS .dmg" "fail" "Build script returned error"
        fi
    else
        log_warn "macOS .dmg can only be built on macOS"
        record_result "macOS .dmg" "skip" "Not running on macOS"
    fi
fi

# ============================================================================
# Linux .deb
# ============================================================================
if [[ "$BUILD_LINUX" == "1" ]]; then
    log_step "Linux .deb Package"
    if command -v dpkg-deb >/dev/null 2>&1; then
        # Build for both architectures
        for deb_arch in amd64 arm64; do
            if bash "$SCRIPT_DIR/packaging/linux/create-deb.sh" --version "$VERSION" --arch "$deb_arch"; then
                record_result "Linux .deb ($deb_arch)" "ok" "$(ls -lh "$BUILD_DIR"/*${deb_arch}*.deb 2>/dev/null | awk '{print $5, $NF}' | head -1)"
            else
                record_result "Linux .deb ($deb_arch)" "fail" "Build script returned error"
            fi
        done
    else
        log_warn "dpkg-deb not found — install with: sudo apt install dpkg"
        record_result "Linux .deb" "skip" "dpkg-deb not available"
    fi
fi

# ============================================================================
# Portable Archives
# ============================================================================
if [[ "$BUILD_PORTABLE" == "1" ]]; then
    log_step "Portable Archives"
    if bash "$SCRIPT_DIR/packaging/portable/create-portable.sh" --version "$VERSION" --platform all; then
        local_count=$(ls "$BUILD_DIR"/*portable* 2>/dev/null | wc -l | tr -d ' ')
        record_result "Portable archives" "ok" "${local_count} packages built"
    else
        record_result "Portable archives" "fail" "Some platforms failed"
    fi
fi

# ============================================================================
# Windows (preparation only — actual build requires NSIS on Windows)
# ============================================================================
if [[ "$BUILD_WINDOWS" == "1" ]]; then
    log_step "Windows Installer (Preparation)"

    WIN_STAGING="$BUILD_DIR/windows-installer-files"
    rm -rf "$WIN_STAGING"
    mkdir -p "$WIN_STAGING"

    # Copy all Windows packaging files
    cp "$SCRIPT_DIR/packaging/windows/installer.nsi" "$WIN_STAGING/"
    cp "$SCRIPT_DIR/packaging/windows/claude.ps1"    "$WIN_STAGING/"
    cp "$SCRIPT_DIR/packaging/windows/claude-wrapper.cmd" "$WIN_STAGING/"
    cp "$SCRIPT_DIR/scripts/install-claude.sh"       "$WIN_STAGING/"

    # Copy assets if they exist
    if [[ -d "$SCRIPT_DIR/assets" ]]; then
        cp -r "$SCRIPT_DIR/assets" "$WIN_STAGING/"
    fi

    # Copy LICENSE and README
    for f in LICENSE.txt README.md; do
        if [[ -f "$SCRIPT_DIR/$f" ]]; then
            cp "$SCRIPT_DIR/$f" "$WIN_STAGING/"
        fi
    done

    # Create a build instruction file
    cat > "$WIN_STAGING/BUILD-WINDOWS.txt" << 'WINBUILD'
Windows .exe Installer Build Instructions
==========================================

Prerequisites:
  1. Install NSIS 3.x from: https://nsis.sourceforge.io/Download
  2. Ensure 'makensis' is in your PATH

Build Steps:
  1. Open Command Prompt or PowerShell in this directory
  2. Run: makensis installer.nsi
  3. The output will be: ClaudeCode-Setup-VERSION.exe

Optional:
  - To create an icon, place 'claude-icon.ico' in the assets/ folder
  - To sign the installer: signtool sign /f cert.pfx /p PASSWORD ClaudeCode-Setup-*.exe

Testing:
  - Run the .exe installer on a Windows 10+ machine
  - Verify Claude is added to PATH
  - Verify 'claude' command works in a new terminal
WINBUILD

    # Try to build with makensis if available (e.g., on Linux with NSIS installed)
    if command -v makensis >/dev/null 2>&1; then
        log_info "NSIS found — attempting to build .exe..."
        # We need to adjust paths for building from the staging directory
        if (cd "$WIN_STAGING" && makensis installer.nsi 2>&1); then
            record_result "Windows .exe" "ok" "Built with makensis"
        else
            log_warn "makensis build failed — files prepared for manual build"
            record_result "Windows .exe" "skip" "makensis failed; files prepared at $WIN_STAGING"
        fi
    else
        log_info "NSIS not found — Windows installer files prepared for manual build"
        record_result "Windows .exe" "skip" "Files prepared at $WIN_STAGING (build on Windows with NSIS)"
    fi
fi

# ============================================================================
# Build Summary
# ============================================================================
echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}  Build Summary${RESET}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

for r in "${RESULTS[@]}"; do
    echo -e "  $r"
done

echo ""
echo -e "  ${BOLD}Total:${RESET} $TOTAL  |  ${GREEN}Passed:${RESET} $PASSED  |  ${RED}Failed:${RESET} $FAILED  |  ${YELLOW}Skipped:${RESET} $SKIPPED"
echo ""

if [[ -d "$BUILD_DIR" ]]; then
    echo -e "  ${BOLD}Build artifacts:${RESET}"
    echo ""
    ls -lhS "$BUILD_DIR"/ 2>/dev/null | grep -v '^total' | grep -v '/$' | while read -r line; do
        echo "    $line"
    done
    echo ""
fi

echo -e "  ${BOLD}Output directory:${RESET} $BUILD_DIR"
echo ""

# Exit with error if any builds failed
if [[ $FAILED -gt 0 ]]; then
    exit 1
fi