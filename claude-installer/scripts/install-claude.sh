#!/usr/bin/env bash
#
# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║                     Claude Code Installer (Enhanced)                        ║
# ║                                                                            ║
# ║  A robust, production-grade installer for Claude Code CLI.                 ║
# ║  Supports macOS (Intel/Apple Silicon) and Linux (glibc/musl).              ║
# ║                                                                            ║
# ║  Usage:  ./install-claude.sh [OPTIONS] [stable|latest|VERSION]             ║
# ║                                                                            ║
# ║  Options:                                                                  ║
# ║    -h, --help          Show this help message                              ║
# ║    -v, --verbose        Enable verbose/debug output                        ║
# ║    -q, --quiet          Suppress non-essential output                      ║
# ║    -f, --force          Force reinstall even if same version exists         ║
# ║    -n, --dry-run        Show what would be done without executing          ║
# ║    -d, --dir DIR        Custom installation directory                      ║
# ║    -k, --keep           Keep downloaded binary after installation          ║
# ║    -r, --retries N      Number of download retry attempts (default: 3)     ║
# ║    --no-color           Disable colored output                             ║
# ║    --no-verify          Skip checksum verification (not recommended)       ║
# ║    --uninstall          Remove Claude Code installation                    ║
# ║    --check-update       Check for updates without installing               ║
# ║    --version            Show installer version                             ║
# ║                                                                            ║
# ║  Examples:                                                                 ║
# ║    ./install-claude.sh                  # Install latest stable            ║
# ║    ./install-claude.sh latest           # Install latest (incl. pre)       ║
# ║    ./install-claude.sh 1.2.3            # Install specific version         ║
# ║    ./install-claude.sh -v --force       # Verbose forced reinstall         ║
# ║    ./install-claude.sh --check-update   # Check for available updates      ║
# ║                                                                            ║
# ║  Environment Variables:                                                    ║
# ║    CLAUDE_INSTALL_DIR    Override default installation directory            ║
# ║    CLAUDE_NO_COLOR       Disable colored output (set to 1)                 ║
# ║    CLAUDE_VERBOSE        Enable verbose output (set to 1)                  ║
# ║    HTTPS_PROXY           HTTP proxy for downloads                          ║
# ║                                                                            ║
# ╚══════════════════════════════════════════════════════════════════════════════╝
#
# Enhanced by SuperNinja — https://www.ninjatech.ai
# Original structure and core functionality preserved.
# Enhancements: robust error handling, retry logic, colored output, progress
# indicators, logging, dry-run mode, uninstall, update checking, and more.
#

# ==============================================================================
# INSTALLER METADATA
# ==============================================================================
readonly INSTALLER_VERSION="2.0.0"
readonly INSTALLER_NAME="Claude Code Installer"
readonly INSTALLER_DATE="2025"

# ==============================================================================
# STRICT MODE & SAFETY
# ==============================================================================
# -e: exit on error | -u: error on unset vars | -o pipefail: catch pipe failures
set -euo pipefail

# Trap signals for clean exit
trap 'cleanup_on_exit' EXIT
trap 'error_handler $LINENO "$BASH_COMMAND"' ERR
trap 'echo ""; log_warn "Installation interrupted by user."; exit 130' INT TERM

# ==============================================================================
# CONFIGURATION DEFAULTS
# ==============================================================================
GCS_BUCKET="https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases"
DOWNLOAD_DIR="${CLAUDE_INSTALL_DIR:-$HOME/.claude/downloads}"
LOG_DIR="$HOME/.claude/logs"
LOG_FILE="$LOG_DIR/install-$(date +%Y%m%d-%H%M%S).log"
LOCK_FILE="/tmp/claude-installer.lock"

# Runtime flags (defaults)
VERBOSE="${CLAUDE_VERBOSE:-0}"
QUIET=0
FORCE=0
DRY_RUN=0
KEEP_BINARY=0
NO_COLOR="${CLAUDE_NO_COLOR:-0}"
NO_VERIFY=0
UNINSTALL=0
CHECK_UPDATE=0
MAX_RETRIES=3
RETRY_DELAY=2
TARGET=""
CUSTOM_DIR=""

# State tracking
BINARY_PATH=""
CLEANUP_FILES=()
INSTALL_START_TIME=""

# ==============================================================================
# COLOR & FORMATTING
# ==============================================================================
setup_colors() {
    if [[ "$NO_COLOR" == "1" ]] || [[ ! -t 1 ]]; then
        RED="" GREEN="" YELLOW="" BLUE="" MAGENTA="" CYAN="" BOLD="" DIM="" RESET=""
    else
        RED='\033[0;31m'
        GREEN='\033[0;32m'
        YELLOW='\033[1;33m'
        BLUE='\033[0;34m'
        MAGENTA='\033[0;35m'
        CYAN='\033[0;36m'
        BOLD='\033[1m'
        DIM='\033[2m'
        RESET='\033[0m'
    fi
}

# ==============================================================================
# LOGGING SYSTEM
# ==============================================================================
# All log functions write to both stdout (formatted) and log file (plain).

log_to_file() {
    local level="$1"
    shift
    if [[ -d "$LOG_DIR" ]]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $*" >> "$LOG_FILE" 2>/dev/null || true
    fi
}

log_info() {
    log_to_file "INFO" "$@"
    if [[ "$QUIET" != "1" ]]; then
        echo -e "${BLUE}ℹ${RESET}  $*"
    fi
}

log_success() {
    log_to_file "OK" "$@"
    if [[ "$QUIET" != "1" ]]; then
        echo -e "${GREEN}✔${RESET}  $*"
    fi
}

log_warn() {
    log_to_file "WARN" "$@"
    echo -e "${YELLOW}⚠${RESET}  $*" >&2
}

log_error() {
    log_to_file "ERROR" "$@"
    echo -e "${RED}✖${RESET}  $*" >&2
}

log_debug() {
    log_to_file "DEBUG" "$@"
    if [[ "$VERBOSE" == "1" ]]; then
        echo -e "${DIM}  [debug] $*${RESET}"
    fi
}

log_step() {
    log_to_file "STEP" "$@"
    if [[ "$QUIET" != "1" ]]; then
        echo -e "\n${BOLD}${CYAN}▶${RESET} ${BOLD}$*${RESET}"
    fi
}

# ==============================================================================
# ERROR HANDLING
# ==============================================================================
error_handler() {
    local line="$1"
    local command="$2"
    local exit_code=$?
    log_error "Command failed at line $line: '$command' (exit code: $exit_code)"
    log_error "Check the log file for details: $LOG_FILE"
}

cleanup_on_exit() {
    local exit_code=$?

    # Remove lock file
    rm -f "$LOCK_FILE" 2>/dev/null || true

    # Clean up temporary files
    for f in "${CLEANUP_FILES[@]:-}"; do
        if [[ -n "$f" ]] && [[ -f "$f" ]]; then
            rm -f "$f" 2>/dev/null || true
            log_debug "Cleaned up: $f"
        fi
    done

    # Report timing on success
    if [[ $exit_code -eq 0 ]] && [[ -n "${INSTALL_START_TIME:-}" ]]; then
        local elapsed=$(( $(date +%s) - INSTALL_START_TIME ))
        log_debug "Total execution time: ${elapsed}s"
    fi

    exit $exit_code
}

die() {
    log_error "$@"
    exit 1
}

# ==============================================================================
# UTILITY FUNCTIONS
# ==============================================================================

# Check if running as root (warn but don't block)
check_root() {
    if [[ "$(id -u)" -eq 0 ]]; then
        log_warn "Running as root is not recommended. Consider running as a regular user."
    fi
}

# Acquire a lock to prevent concurrent installations
acquire_lock() {
    if [[ -f "$LOCK_FILE" ]]; then
        local lock_pid
        lock_pid=$(cat "$LOCK_FILE" 2>/dev/null || echo "")
        if [[ -n "$lock_pid" ]] && kill -0 "$lock_pid" 2>/dev/null; then
            die "Another installation is already in progress (PID: $lock_pid). If this is incorrect, remove $LOCK_FILE"
        else
            log_debug "Removing stale lock file from PID $lock_pid"
            rm -f "$LOCK_FILE"
        fi
    fi
    echo $$ > "$LOCK_FILE"
    log_debug "Lock acquired (PID: $$)"
}

# Detect available downloader (curl preferred, wget fallback)
detect_downloader() {
    if command -v curl >/dev/null 2>&1; then
        DOWNLOADER="curl"
        DOWNLOADER_VERSION=$(curl --version | head -1 | awk '{print $2}')
        log_debug "Using curl $DOWNLOADER_VERSION"
    elif command -v wget >/dev/null 2>&1; then
        DOWNLOADER="wget"
        DOWNLOADER_VERSION=$(wget --version 2>/dev/null | head -1 | awk '{print $3}' || echo "unknown")
        log_debug "Using wget $DOWNLOADER_VERSION"
    else
        die "Either 'curl' or 'wget' is required but neither is installed.\n   Install one with: sudo apt install curl  OR  brew install curl"
    fi
}

# Detect if jq is available for JSON parsing
detect_jq() {
    HAS_JQ=false
    if command -v jq >/dev/null 2>&1; then
        HAS_JQ=true
        log_debug "jq is available for JSON parsing"
    else
        log_debug "jq not found; using built-in JSON parser"
    fi
}

# Check minimum disk space (100MB)
check_disk_space() {
    local target_dir="$1"
    local required_mb=100

    if command -v df >/dev/null 2>&1; then
        local available_kb
        available_kb=$(df -k "$target_dir" 2>/dev/null | tail -1 | awk '{print $4}')
        if [[ -n "$available_kb" ]] && [[ "$available_kb" =~ ^[0-9]+$ ]]; then
            local available_mb=$((available_kb / 1024))
            if [[ $available_mb -lt $required_mb ]]; then
                die "Insufficient disk space. Need ${required_mb}MB, only ${available_mb}MB available in $target_dir"
            fi
            log_debug "Disk space OK: ${available_mb}MB available in $target_dir"
        fi
    fi
}

# Check network connectivity
check_network() {
    log_debug "Checking network connectivity..."
    local test_url="https://storage.googleapis.com"

    if [[ "$DOWNLOADER" == "curl" ]]; then
        if ! curl -fsSL --connect-timeout 10 --max-time 15 -o /dev/null "$test_url" 2>/dev/null; then
            die "Cannot reach $test_url. Please check your network connection and proxy settings.\n   If behind a proxy, set HTTPS_PROXY environment variable."
        fi
    else
        if ! wget -q --timeout=10 --tries=1 -O /dev/null "$test_url" 2>/dev/null; then
            die "Cannot reach $test_url. Please check your network connection and proxy settings.\n   If behind a proxy, set HTTPS_PROXY environment variable."
        fi
    fi
    log_debug "Network connectivity OK"
}

# Download function with retry logic and progress indication
download_file() {
    local url="$1"
    local output="${2:-}"
    local attempt=0
    local max_attempts=$MAX_RETRIES

    while [[ $attempt -lt $max_attempts ]]; do
        attempt=$((attempt + 1))

        if [[ $attempt -gt 1 ]]; then
            log_warn "Download attempt $attempt/$max_attempts (retrying in ${RETRY_DELAY}s)..."
            sleep "$RETRY_DELAY"
            RETRY_DELAY=$((RETRY_DELAY * 2))  # Exponential backoff
        fi

        log_debug "Downloading: $url (attempt $attempt/$max_attempts)"

        if [[ "$DOWNLOADER" == "curl" ]]; then
            local curl_opts=("-fSL" "--connect-timeout" "30" "--max-time" "300" "--retry" "0")

            # Add progress bar for binary downloads (when output is specified and not quiet)
            if [[ -n "$output" ]] && [[ "$QUIET" != "1" ]] && [[ -t 1 ]]; then
                curl_opts+=("--progress-bar")
            else
                curl_opts+=("-s")
            fi

            # Proxy support
            if [[ -n "${HTTPS_PROXY:-}" ]]; then
                curl_opts+=("--proxy" "$HTTPS_PROXY")
            fi

            if [[ -n "$output" ]]; then
                if curl "${curl_opts[@]}" -o "$output" "$url" 2>/dev/null; then
                    return 0
                fi
            else
                local result
                if result=$(curl "${curl_opts[@]}" "$url" 2>/dev/null); then
                    echo "$result"
                    return 0
                fi
            fi
        elif [[ "$DOWNLOADER" == "wget" ]]; then
            local wget_opts=("-q" "--timeout=30" "--tries=1")

            # Show progress for binary downloads
            if [[ -n "$output" ]] && [[ "$QUIET" != "1" ]] && [[ -t 1 ]]; then
                wget_opts=("--show-progress" "--timeout=30" "--tries=1")
            fi

            # Proxy support
            if [[ -n "${HTTPS_PROXY:-}" ]]; then
                export https_proxy="$HTTPS_PROXY"
            fi

            if [[ -n "$output" ]]; then
                if wget "${wget_opts[@]}" -O "$output" "$url" 2>/dev/null; then
                    return 0
                fi
            else
                local result
                if result=$(wget -q -O - --timeout=30 --tries=1 "$url" 2>/dev/null); then
                    echo "$result"
                    return 0
                fi
            fi
        fi

        log_debug "Download attempt $attempt failed for: $url"
    done

    return 1
}

# ==============================================================================
# JSON PARSING (fallback when jq is unavailable)
# ==============================================================================
get_checksum_from_manifest() {
    local json="$1"
    local platform="$2"

    # Normalize JSON: collapse whitespace
    json=$(echo "$json" | tr -d '\n\r\t' | sed 's/  */ /g')

    # Extract checksum for the given platform using bash regex
    local dq='"'
    local pattern="${dq}${platform}${dq}[^}]*${dq}checksum${dq}[[:space:]]*:[[:space:]]*${dq}([a-f0-9]{64})${dq}"
    if [[ $json =~ $pattern ]]; then
        echo "${BASH_REMATCH[1]}"
        return 0
    fi

    return 1
}

# Extract a simple top-level string value from JSON (fallback parser)
json_extract_string() {
    local json="$1"
    local key="$2"
    json=$(echo "$json" | tr -d '\n\r\t')
    local dq='"'
    local pattern="${dq}${key}${dq}[[:space:]]*:[[:space:]]*${dq}([^${dq}]+)${dq}"
    if [[ $json =~ $pattern ]]; then
        echo "${BASH_REMATCH[1]}"
        return 0
    fi
    return 1
}

# ==============================================================================
# PLATFORM DETECTION
# ==============================================================================
detect_platform() {
    log_step "Detecting platform"

    # Detect OS
    case "$(uname -s)" in
        Darwin)
            os="darwin"
            os_display="macOS"
            ;;
        Linux)
            os="linux"
            os_display="Linux"
            ;;
        MINGW*|MSYS*|CYGWIN*)
            die "Windows is not supported by this script.\n   See https://code.claude.com/docs for Windows installation options."
            ;;
        *)
            die "Unsupported operating system: $(uname -s).\n   See https://code.claude.com/docs for supported platforms."
            ;;
    esac

    # Detect architecture
    case "$(uname -m)" in
        x86_64|amd64)
            arch="x64"
            arch_display="x86_64"
            ;;
        arm64|aarch64)
            arch="arm64"
            arch_display="ARM64"
            ;;
        *)
            die "Unsupported architecture: $(uname -m).\n   Supported: x86_64, arm64/aarch64"
            ;;
    esac

    # Detect Rosetta 2 on macOS: prefer native arm64 binary
    if [[ "$os" == "darwin" ]] && [[ "$arch" == "x64" ]]; then
        if [[ "$(sysctl -n sysctl.proc_translated 2>/dev/null)" == "1" ]]; then
            log_info "Rosetta 2 detected — switching to native arm64 binary"
            arch="arm64"
            arch_display="ARM64 (native, via Rosetta detection)"
        fi
    fi

    # Detect musl vs glibc on Linux
    libc_variant=""
    if [[ "$os" == "linux" ]]; then
        if [[ -f /lib/libc.musl-x86_64.so.1 ]] || \
           [[ -f /lib/libc.musl-aarch64.so.1 ]] || \
           [[ -f /lib/ld-musl-x86_64.so.1 ]] || \
           [[ -f /lib/ld-musl-aarch64.so.1 ]] || \
           (ldd /bin/ls 2>&1 | grep -qi musl); then
            libc_variant="-musl"
            log_debug "Detected musl libc"
        else
            log_debug "Detected glibc"
        fi
        platform="linux-${arch}${libc_variant}"
    else
        platform="${os}-${arch}"
    fi

    log_success "Platform: ${BOLD}${os_display} ${arch_display}${RESET} (${platform})"
    log_debug "OS: $os | Arch: $arch | Platform string: $platform"
}

# ==============================================================================
# VERSION MANAGEMENT
# ==============================================================================
get_installed_version() {
    if command -v claude >/dev/null 2>&1; then
        claude --version 2>/dev/null | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo ""
    else
        echo ""
    fi
}

resolve_version() {
    log_step "Resolving version"

    local requested="${TARGET:-stable}"
    log_debug "Requested target: $requested"

    # Fetch the latest version identifier from the bucket
    latest_version=$(download_file "$GCS_BUCKET/latest") || die "Failed to fetch latest version information. Check your network connection."

    if [[ -z "$latest_version" ]]; then
        die "Received empty version string from server."
    fi

    log_debug "Latest version from server: $latest_version"

    # For specific version requests, we still use the latest installer
    # but pass the target version to the install command
    version="$latest_version"

    # Check if already installed (unless --force)
    local installed_version
    installed_version=$(get_installed_version)
    if [[ -n "$installed_version" ]]; then
        log_info "Currently installed: v${installed_version}"
        if [[ "$installed_version" == "$latest_version" ]] && [[ "$FORCE" != "1" ]] && [[ -z "$TARGET" ]]; then
            log_success "Already up to date (v${installed_version}). Use --force to reinstall."
            exit 0
        fi
    fi

    log_success "Target version: ${BOLD}v${version}${RESET}"
}

check_for_updates() {
    log_step "Checking for updates"

    local installed_version
    installed_version=$(get_installed_version)

    local latest_version
    latest_version=$(download_file "$GCS_BUCKET/latest") || die "Failed to fetch version information."

    if [[ -z "$installed_version" ]]; then
        log_info "Claude Code is not currently installed."
        log_info "Latest available version: ${BOLD}v${latest_version}${RESET}"
        log_info "Run this script without --check-update to install."
    elif [[ "$installed_version" == "$latest_version" ]]; then
        log_success "You are running the latest version: ${BOLD}v${installed_version}${RESET}"
    else
        log_info "Installed version: v${installed_version}"
        log_info "Latest version:    ${BOLD}v${latest_version}${RESET}"
        log_info "Run this script to update."
    fi
}

# ==============================================================================
# DOWNLOAD & VERIFICATION
# ==============================================================================
download_and_verify() {
    log_step "Downloading Claude Code"

    # Fetch manifest
    log_info "Fetching release manifest..."
    local manifest_json
    manifest_json=$(download_file "$GCS_BUCKET/$version/manifest.json") || die "Failed to download release manifest."

    log_debug "Manifest received (${#manifest_json} bytes)"

    # Extract checksum for our platform
    local checksum=""
    if [[ "$HAS_JQ" == "true" ]]; then
        checksum=$(echo "$manifest_json" | jq -r --arg p "$platform" '.platforms[$p].checksum // empty' 2>/dev/null)
    else
        checksum=$(get_checksum_from_manifest "$manifest_json" "$platform") || true
    fi

    # Validate checksum format (SHA-256 = 64 hex characters)
    if [[ -z "$checksum" ]] || [[ ! "$checksum" =~ ^[a-f0-9]{64}$ ]]; then
        die "Platform '${platform}' not found in release manifest.\n   This platform may not be supported for this release.\n   Available platforms can be checked at: $GCS_BUCKET/$version/manifest.json"
    fi

    log_debug "Expected SHA-256: $checksum"

    # Prepare download path
    BINARY_PATH="$DOWNLOAD_DIR/claude-$version-$platform"
    CLEANUP_FILES+=("$BINARY_PATH")

    # Check if binary already downloaded and valid (cache hit)
    if [[ -f "$BINARY_PATH" ]] && [[ "$FORCE" != "1" ]]; then
        log_debug "Found cached binary, verifying..."
        local cached_checksum
        cached_checksum=$(compute_checksum "$BINARY_PATH")
        if [[ "$cached_checksum" == "$checksum" ]]; then
            log_success "Using cached binary (checksum verified)"
            return 0
        else
            log_debug "Cached binary checksum mismatch, re-downloading"
            rm -f "$BINARY_PATH"
        fi
    fi

    # Download binary
    local download_url="$GCS_BUCKET/$version/$platform/claude"
    log_info "Downloading from: ${DIM}${download_url}${RESET}"

    if [[ "$DRY_RUN" == "1" ]]; then
        log_info "[DRY RUN] Would download: $download_url"
        log_info "[DRY RUN] Would save to: $BINARY_PATH"
        return 0
    fi

    if ! download_file "$download_url" "$BINARY_PATH"; then
        rm -f "$BINARY_PATH"
        die "Download failed after $MAX_RETRIES attempts.\n   URL: $download_url\n   Check your network connection and try again."
    fi

    # Verify file was actually downloaded and has content
    if [[ ! -f "$BINARY_PATH" ]] || [[ ! -s "$BINARY_PATH" ]]; then
        rm -f "$BINARY_PATH"
        die "Downloaded file is empty or missing."
    fi

    local file_size
    file_size=$(wc -c < "$BINARY_PATH" | tr -d ' ')
    log_debug "Downloaded ${file_size} bytes"

    # Checksum verification
    if [[ "$NO_VERIFY" == "1" ]]; then
        log_warn "Checksum verification SKIPPED (--no-verify). This is not recommended."
    else
        log_step "Verifying integrity"
        local actual_checksum
        actual_checksum=$(compute_checksum "$BINARY_PATH")

        log_debug "Actual SHA-256:   $actual_checksum"
        log_debug "Expected SHA-256: $checksum"

        if [[ "$actual_checksum" != "$checksum" ]]; then
            rm -f "$BINARY_PATH"
            die "Checksum verification FAILED!\n   Expected: $checksum\n   Actual:   $actual_checksum\n   The download may be corrupted. Please try again."
        fi

        log_success "Checksum verified (SHA-256)"
    fi

    # Make executable
    chmod +x "$BINARY_PATH"
    log_debug "Set executable permission on $BINARY_PATH"
}

# Compute SHA-256 checksum (cross-platform)
compute_checksum() {
    local file="$1"
    if [[ "$os" == "darwin" ]]; then
        shasum -a 256 "$file" | cut -d' ' -f1
    else
        sha256sum "$file" | cut -d' ' -f1
    fi
}

# ==============================================================================
# INSTALLATION
# ==============================================================================
run_install() {
    log_step "Installing Claude Code"

    if [[ "$DRY_RUN" == "1" ]]; then
        log_info "[DRY RUN] Would execute: $BINARY_PATH install ${TARGET:+$TARGET}"
        return 0
    fi

    log_info "Running Claude Code setup..."

    # Execute the installer binary
    if ! "$BINARY_PATH" install ${TARGET:+"$TARGET"}; then
        die "Installation command failed. Check the output above for details."
    fi

    log_success "Claude Code installed successfully"
}

# ==============================================================================
# UNINSTALL
# ==============================================================================
run_uninstall() {
    log_step "Uninstalling Claude Code"

    if ! command -v claude >/dev/null 2>&1; then
        log_warn "Claude Code does not appear to be installed."
        exit 0
    fi

    local installed_version
    installed_version=$(get_installed_version)
    log_info "Found Claude Code v${installed_version}"

    if [[ "$DRY_RUN" == "1" ]]; then
        log_info "[DRY RUN] Would uninstall Claude Code"
        log_info "[DRY RUN] Would remove $HOME/.claude"
        return 0
    fi

    # Attempt to use claude's own uninstall if available
    if claude uninstall 2>/dev/null; then
        log_success "Claude Code uninstalled via built-in uninstaller"
    else
        log_warn "Built-in uninstaller not available. Performing manual cleanup..."

        # Remove common installation locations
        local locations=(
            "$HOME/.claude"
            "$HOME/.local/bin/claude"
            "/usr/local/bin/claude"
        )

        for loc in "${locations[@]}"; do
            if [[ -e "$loc" ]]; then
                rm -rf "$loc"
                log_info "Removed: $loc"
            fi
        done

        log_success "Claude Code removed"
    fi
}

# ==============================================================================
# POST-INSTALL
# ==============================================================================
post_install_summary() {
    if [[ "$QUIET" == "1" ]] || [[ "$DRY_RUN" == "1" ]]; then
        return 0
    fi

    # Clean up downloaded binary (unless --keep)
    if [[ "$KEEP_BINARY" != "1" ]] && [[ -n "$BINARY_PATH" ]] && [[ -f "$BINARY_PATH" ]]; then
        rm -f "$BINARY_PATH"
        log_debug "Cleaned up downloaded binary"
    elif [[ "$KEEP_BINARY" == "1" ]] && [[ -n "$BINARY_PATH" ]]; then
        log_info "Binary kept at: $BINARY_PATH"
        # Remove from cleanup list
        CLEANUP_FILES=()
    fi

    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo -e "${GREEN}  ✅ Installation complete!${RESET}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo ""
    echo -e "  ${BOLD}Version:${RESET}   v${version}"
    echo -e "  ${BOLD}Platform:${RESET}  ${os_display} ${arch_display} (${platform})"
    echo ""
    echo -e "  ${BOLD}Quick Start:${RESET}"
    echo -e "    ${CYAN}claude${RESET}            Open Claude Code"
    echo -e "    ${CYAN}claude --help${RESET}     Show available commands"
    echo -e "    ${CYAN}claude update${RESET}     Check for updates"
    echo ""
    echo -e "  ${DIM}Log file: $LOG_FILE${RESET}"
    echo ""

    # Shell restart hint
    if [[ -n "${SHELL:-}" ]]; then
        local shell_name
        shell_name=$(basename "$SHELL")
        echo -e "  ${YELLOW}💡 Tip:${RESET} Restart your shell or run: ${CYAN}source ~/.${shell_name}rc${RESET}"
        echo ""
    fi
}

# ==============================================================================
# HELP & VERSION
# ==============================================================================
show_help() {
    cat << 'HELPEOF'
╔══════════════════════════════════════════════════════════════════════════════╗
║                     Claude Code Installer (Enhanced)                        ║
╚══════════════════════════════════════════════════════════════════════════════╝

USAGE:
    install-claude.sh [OPTIONS] [TARGET]

TARGET:
    stable              Install latest stable release (default)
    latest              Install latest release (including pre-releases)
    VERSION             Install a specific version (e.g., 1.2.3, 1.2.3-beta.1)

OPTIONS:
    -h, --help          Show this help message and exit
    -v, --verbose       Enable verbose/debug output
    -q, --quiet         Suppress non-essential output
    -f, --force         Force reinstall even if same version is installed
    -n, --dry-run       Show what would be done without making changes
    -d, --dir DIR       Custom download directory
    -k, --keep          Keep downloaded binary after installation
    -r, --retries N     Number of download retry attempts (default: 3)
    --no-color          Disable colored output
    --no-verify         Skip checksum verification (NOT recommended)
    --uninstall         Remove Claude Code installation
    --check-update      Check for updates without installing
    --version           Show installer version

ENVIRONMENT VARIABLES:
    CLAUDE_INSTALL_DIR  Override default download directory
    CLAUDE_NO_COLOR     Disable colored output (set to 1)
    CLAUDE_VERBOSE      Enable verbose output (set to 1)
    HTTPS_PROXY         HTTP proxy for downloads

EXAMPLES:
    # Install latest stable version
    ./install-claude.sh

    # Install with verbose output
    ./install-claude.sh -v

    # Install specific version
    ./install-claude.sh 1.2.3

    # Force reinstall latest
    ./install-claude.sh --force latest

    # Dry run to see what would happen
    ./install-claude.sh --dry-run

    # Check for updates
    ./install-claude.sh --check-update

    # Uninstall
    ./install-claude.sh --uninstall

HELPEOF
    exit 0
}

show_version() {
    echo "$INSTALLER_NAME v$INSTALLER_VERSION ($INSTALLER_DATE)"
    exit 0
}

# ==============================================================================
# ARGUMENT PARSING
# ==============================================================================
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                show_help
                ;;
            --version)
                show_version
                ;;
            -v|--verbose)
                VERBOSE=1
                shift
                ;;
            -q|--quiet)
                QUIET=1
                shift
                ;;
            -f|--force)
                FORCE=1
                shift
                ;;
            -n|--dry-run)
                DRY_RUN=1
                shift
                ;;
            -k|--keep)
                KEEP_BINARY=1
                shift
                ;;
            -d|--dir)
                if [[ -z "${2:-}" ]]; then
                    die "Option $1 requires an argument."
                fi
                CUSTOM_DIR="$2"
                DOWNLOAD_DIR="$2"
                shift 2
                ;;
            -r|--retries)
                if [[ -z "${2:-}" ]] || [[ ! "$2" =~ ^[0-9]+$ ]]; then
                    die "Option $1 requires a numeric argument."
                fi
                MAX_RETRIES="$2"
                shift 2
                ;;
            --no-color)
                NO_COLOR=1
                shift
                ;;
            --no-verify)
                NO_VERIFY=1
                shift
                ;;
            --uninstall)
                UNINSTALL=1
                shift
                ;;
            --check-update)
                CHECK_UPDATE=1
                shift
                ;;
            -*)
                die "Unknown option: $1\nRun with --help for usage information."
                ;;
            *)
                # Positional argument: target version
                if [[ -n "$TARGET" ]]; then
                    die "Multiple targets specified: '$TARGET' and '$1'.\nOnly one target is allowed."
                fi
                # Validate target format
                if [[ ! "$1" =~ ^(stable|latest|[0-9]+\.[0-9]+\.[0-9]+(-[^[:space:]]+)?)$ ]]; then
                    die "Invalid target: '$1'\nExpected: stable, latest, or a version like 1.2.3\nRun with --help for usage information."
                fi
                TARGET="$1"
                shift
                ;;
        esac
    done

    # Conflicting options
    if [[ "$QUIET" == "1" ]] && [[ "$VERBOSE" == "1" ]]; then
        die "Cannot use --quiet and --verbose together."
    fi
}

# ==============================================================================
# BANNER
# ==============================================================================
show_banner() {
    if [[ "$QUIET" == "1" ]]; then
        return 0
    fi

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
    echo -e "  ${DIM}Installer v${INSTALLER_VERSION} — Enhanced Edition${RESET}"
    echo ""
}

# ==============================================================================
# MAIN EXECUTION
# ==============================================================================
main() {
    INSTALL_START_TIME=$(date +%s)

    # Parse all command-line arguments first
    parse_arguments "$@"

    # Initialize colors (after --no-color might be set)
    setup_colors

    # Show banner
    show_banner

    # Initialize logging
    mkdir -p "$LOG_DIR" 2>/dev/null || true
    mkdir -p "$DOWNLOAD_DIR" 2>/dev/null || true
    log_debug "Installer v${INSTALLER_VERSION} started"
    log_debug "Arguments: $*"
    log_debug "Shell: ${SHELL:-unknown} | Bash: ${BASH_VERSION:-unknown}"

    # Handle special modes
    if [[ "$UNINSTALL" == "1" ]]; then
        detect_downloader
        setup_colors
        run_uninstall
        exit 0
    fi

    if [[ "$CHECK_UPDATE" == "1" ]]; then
        detect_downloader
        check_network
        check_for_updates
        exit 0
    fi

    # Dry-run notice
    if [[ "$DRY_RUN" == "1" ]]; then
        log_warn "DRY RUN MODE — no changes will be made"
        echo ""
    fi

    # Pre-flight checks
    log_step "Pre-flight checks"
    check_root
    acquire_lock
    detect_downloader
    detect_jq
    check_network
    check_disk_space "$DOWNLOAD_DIR"
    log_success "All pre-flight checks passed"

    # Core installation flow
    detect_platform
    resolve_version
    download_and_verify
    run_install
    post_install_summary
}

# Entry point — pass all script arguments to main
main "$@"