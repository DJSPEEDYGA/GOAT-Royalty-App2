#!/usr/bin/env bash
# ============================================================================
# Claude Code — Portable Package Creator
# ============================================================================
# Creates self-contained portable archives for all supported platforms.
# The portable version requires no installation — just extract and run.
#
# Usage:
#   ./create-portable.sh [--version VERSION] [--platform PLATFORM]
#
# Platforms:
#   all (default), darwin-arm64, darwin-x64, linux-x64, linux-arm64, linux-x64-musl
#
# Output:
#   ../../build/ClaudeCode-VERSION-PLATFORM-portable.tar.gz  (macOS/Linux)
#   ../../build/ClaudeCode-VERSION-PLATFORM-portable.zip     (Windows)
# ============================================================================

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BUILD_DIR="$PROJECT_ROOT/build"
VERSION="2.0.0"
TARGET_PLATFORM="all"

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
log_step()  { echo -e "\n${BOLD}▶ $*${RESET}"; }

# ============================================================================
# Parse arguments
# ============================================================================
while [[ $# -gt 0 ]]; do
    case "$1" in
        --version)  VERSION="$2"; shift 2 ;;
        --platform) TARGET_PLATFORM="$2"; shift 2 ;;
        --help|-h)
            echo "Usage: $0 [--version VERSION] [--platform PLATFORM]"
            echo ""
            echo "Platforms: all, darwin-arm64, darwin-x64, linux-x64, linux-arm64, linux-x64-musl"
            exit 0
            ;;
        *) shift ;;
    esac
done

GCS_BUCKET="https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases"

# Detect downloader
if command -v curl >/dev/null 2>&1; then
    dl() { curl -fsSL ${2:+-o "$2"} "$1"; }
elif command -v wget >/dev/null 2>&1; then
    dl() { wget -q ${2:+-O "$2"} ${2:--O -} "$1"; }
else
    log_err "curl or wget is required"
    exit 1
fi

# ============================================================================
# Build portable package for a single platform
# ============================================================================
build_portable() {
    local platform="$1"
    local version="$2"

    log_step "Building portable package: ${platform}"

    local staging="$BUILD_DIR/portable-staging-${platform}"
    local pkg_name="ClaudeCode-${version}-${platform}-portable"

    # Clean staging
    rm -rf "$staging"
    mkdir -p "$staging/claude-code"

    # ---- Download binary ----
    log_info "Downloading binary for ${platform}..."
    local binary_url="$GCS_BUCKET/$version/$platform/claude"
    local binary_path="$staging/claude-code/claude"

    if ! dl "$binary_url" "$binary_path" 2>/dev/null; then
        log_warn "Failed to download binary for ${platform} — skipping"
        log_warn "  URL: $binary_url"
        rm -rf "$staging"
        return 1
    fi

    # Verify download is not empty
    if [[ ! -s "$binary_path" ]]; then
        log_warn "Downloaded binary is empty for ${platform} — skipping"
        rm -rf "$staging"
        return 1
    fi

    chmod +x "$binary_path"
    log_ok "Binary downloaded ($(wc -c < "$binary_path" | tr -d ' ') bytes)"

    # ---- Verify checksum ----
    log_info "Verifying checksum..."
    local manifest_json
    manifest_json=$(dl "$GCS_BUCKET/$version/manifest.json" 2>/dev/null) || true

    if [[ -n "$manifest_json" ]]; then
        local expected_checksum=""
        if command -v jq >/dev/null 2>&1; then
            expected_checksum=$(echo "$manifest_json" | jq -r --arg p "$platform" '.platforms[$p].checksum // empty' 2>/dev/null)
        fi

        if [[ -n "$expected_checksum" ]]; then
            local actual_checksum
            if command -v sha256sum >/dev/null 2>&1; then
                actual_checksum=$(sha256sum "$binary_path" | cut -d' ' -f1)
            elif command -v shasum >/dev/null 2>&1; then
                actual_checksum=$(shasum -a 256 "$binary_path" | cut -d' ' -f1)
            fi

            if [[ -n "${actual_checksum:-}" ]]; then
                if [[ "$actual_checksum" == "$expected_checksum" ]]; then
                    log_ok "Checksum verified"
                else
                    log_err "Checksum mismatch for ${platform}!"
                    rm -rf "$staging"
                    return 1
                fi
            fi
        else
            log_warn "Could not extract checksum from manifest (jq may be needed)"
        fi
    fi

    # ---- Create launcher scripts ----

    # Unix launcher (bash)
    cat > "$staging/claude-code/run.sh" << 'RUNSH'
#!/usr/bin/env bash
# Claude Code — Portable Launcher
# Run this script from any location to start Claude Code.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_BIN="$SCRIPT_DIR/claude"

if [[ ! -x "$CLAUDE_BIN" ]]; then
    echo "Error: Claude binary not found at $CLAUDE_BIN" >&2
    exit 1
fi

# Set up portable environment
export CLAUDE_HOME="${CLAUDE_HOME:-$SCRIPT_DIR/.claude-data}"
mkdir -p "$CLAUDE_HOME"

exec "$CLAUDE_BIN" "$@"
RUNSH
    chmod +x "$staging/claude-code/run.sh"

    # Windows launcher (cmd) — included for completeness
    cat > "$staging/claude-code/run.cmd" << 'RUNCMD'
@echo off
:: Claude Code — Portable Launcher (Windows)
setlocal
set "SCRIPT_DIR=%~dp0"
set "CLAUDE_BIN=%SCRIPT_DIR%claude.exe"

if not exist "%CLAUDE_BIN%" (
    echo Error: Claude binary not found at %CLAUDE_BIN%
    exit /b 1
)

set "CLAUDE_HOME=%SCRIPT_DIR%.claude-data"
if not exist "%CLAUDE_HOME%" mkdir "%CLAUDE_HOME%"

"%CLAUDE_BIN%" %*
RUNCMD

    # ---- Copy documentation ----
    cp "$PROJECT_ROOT/scripts/install-claude.sh" "$staging/claude-code/install-claude.sh"
    chmod +x "$staging/claude-code/install-claude.sh"

    # Create portable README
    cat > "$staging/claude-code/README.txt" << README
╔══════════════════════════════════════════════════════════════════════════╗
║                    Claude Code — Portable Edition                       ║
║                         Version: ${version}                             ║
║                         Platform: ${platform}                           ║
╚══════════════════════════════════════════════════════════════════════════╝

QUICK START:
  macOS/Linux:  ./run.sh
  Windows:      run.cmd

  Or run the binary directly:
    ./claude [arguments]

PORTABLE DATA:
  All user data is stored in .claude-data/ next to the binary.
  To use a different location, set the CLAUDE_HOME environment variable.

FULL INSTALLATION:
  If you prefer a system-wide install, run:
    ./install-claude.sh

MORE INFO:
  https://code.claude.com/docs

README

    # ---- Create version file ----
    echo "$version" > "$staging/claude-code/VERSION"

    # ---- Create archive ----
    log_info "Creating archive..."
    local archive_path

    # Use tar.gz for Unix platforms, zip for Windows
    if [[ "$platform" == win32-* ]]; then
        archive_path="$BUILD_DIR/${pkg_name}.zip"
        (cd "$staging" && zip -r -9 "$archive_path" claude-code/)
    else
        archive_path="$BUILD_DIR/${pkg_name}.tar.gz"
        (cd "$staging" && tar -czf "$archive_path" claude-code/)
    fi

    # Get archive size
    local archive_size
    archive_size=$(du -h "$archive_path" | cut -f1)

    log_ok "Archive created: ${BOLD}${archive_path}${RESET} (${archive_size})"

    # ---- Cleanup staging ----
    rm -rf "$staging"

    return 0
}

# ============================================================================
# Main
# ============================================================================
echo ""
echo -e "${BOLD}${CYAN}"
echo "  Claude Code — Portable Package Builder"
echo -e "${RESET}${DIM}  Version: ${VERSION}${RESET}"
echo ""

mkdir -p "$BUILD_DIR"

# Resolve version from server
log_step "Resolving version"
RESOLVED_VERSION=$(dl "$GCS_BUCKET/latest" 2>/dev/null) || true
if [[ -z "$RESOLVED_VERSION" ]]; then
    log_warn "Could not fetch latest version from server. Using: $VERSION"
    RESOLVED_VERSION="$VERSION"
fi
RESOLVED_VERSION=$(echo "$RESOLVED_VERSION" | tr -d '[:space:]')
log_ok "Version: ${RESOLVED_VERSION}"

# Define platforms to build
ALL_PLATFORMS=(
    "darwin-arm64"
    "darwin-x64"
    "linux-x64"
    "linux-arm64"
    "linux-x64-musl"
    "linux-arm64-musl"
)

PLATFORMS=()
if [[ "$TARGET_PLATFORM" == "all" ]]; then
    PLATFORMS=("${ALL_PLATFORMS[@]}")
else
    PLATFORMS=("$TARGET_PLATFORM")
fi

# Build each platform
SUCCESS_COUNT=0
FAIL_COUNT=0
RESULTS=()

for plat in "${PLATFORMS[@]}"; do
    if build_portable "$plat" "$RESOLVED_VERSION"; then
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        RESULTS+=("  ${GREEN}✔${RESET}  $plat")
    else
        FAIL_COUNT=$((FAIL_COUNT + 1))
        RESULTS+=("  ${RED}✖${RESET}  $plat (failed)")
    fi
done

# ============================================================================
# Summary
# ============================================================================
echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}  Build Summary${RESET}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""
for r in "${RESULTS[@]}"; do
    echo -e "$r"
done
echo ""
echo -e "  ${BOLD}Success:${RESET} $SUCCESS_COUNT  |  ${BOLD}Failed:${RESET} $FAIL_COUNT"
echo ""

if [[ $SUCCESS_COUNT -gt 0 ]]; then
    echo -e "  ${BOLD}Output directory:${RESET} $BUILD_DIR"
    echo ""
    ls -lh "$BUILD_DIR"/*.tar.gz "$BUILD_DIR"/*.zip 2>/dev/null | while read -r line; do
        echo "    $line"
    done
    echo ""
fi

if [[ $FAIL_COUNT -gt 0 ]]; then
    exit 1
fi