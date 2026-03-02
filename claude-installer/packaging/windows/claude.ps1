#Requires -Version 5.1
<#
.SYNOPSIS
    Claude Code Installer/Launcher for Windows
.DESCRIPTION
    PowerShell script that downloads, verifies, and installs Claude Code on Windows.
    Can also serve as a launcher wrapper.
.PARAMETER Action
    The action to perform: install, update, uninstall, check-update, or launch
.PARAMETER Version
    Specific version to install (e.g., "1.2.3"). Default: latest stable.
.PARAMETER Force
    Force reinstall even if same version is already installed.
.PARAMETER NoVerify
    Skip checksum verification (not recommended).
.EXAMPLE
    .\claude.ps1 -Action install
    .\claude.ps1 -Action install -Version "1.2.3"
    .\claude.ps1 -Action update
    .\claude.ps1 -Action check-update
    .\claude.ps1 -Action uninstall
#>

[CmdletBinding()]
param(
    [ValidateSet("install", "update", "uninstall", "check-update", "launch")]
    [string]$Action = "install",

    [ValidatePattern('^(stable|latest|[0-9]+\.[0-9]+\.[0-9]+(-[^\s]+)?)$')]
    [string]$Version = "stable",

    [switch]$Force,
    [switch]$NoVerify,
    [switch]$Quiet
)

# ============================================================================
# Configuration
# ============================================================================
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"  # Speed up Invoke-WebRequest

$GCS_BUCKET = "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases"
$INSTALL_DIR = Join-Path $env:LOCALAPPDATA "Programs\ClaudeCode"
$BIN_DIR = Join-Path $INSTALL_DIR "bin"
$DOWNLOAD_DIR = Join-Path $env:USERPROFILE ".claude\downloads"
$LOG_DIR = Join-Path $env:USERPROFILE ".claude\logs"
$LOG_FILE = Join-Path $LOG_DIR "install-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

# ============================================================================
# Logging Functions
# ============================================================================
function Write-Log {
    param([string]$Level, [string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    if (Test-Path (Split-Path $LOG_FILE)) {
        Add-Content -Path $LOG_FILE -Value $logEntry -ErrorAction SilentlyContinue
    }
}

function Write-Info {
    param([string]$Message)
    Write-Log "INFO" $Message
    if (-not $Quiet) { Write-Host "  i  $Message" -ForegroundColor Cyan }
}

function Write-Success {
    param([string]$Message)
    Write-Log "OK" $Message
    if (-not $Quiet) { Write-Host "  +  $Message" -ForegroundColor Green }
}

function Write-Warn {
    param([string]$Message)
    Write-Log "WARN" $Message
    Write-Host "  !  $Message" -ForegroundColor Yellow
}

function Write-Err {
    param([string]$Message)
    Write-Log "ERROR" $Message
    Write-Host "  X  $Message" -ForegroundColor Red
}

function Write-Step {
    param([string]$Message)
    Write-Log "STEP" $Message
    if (-not $Quiet) { Write-Host "`n  >  $Message" -ForegroundColor White }
}

# ============================================================================
# Utility Functions
# ============================================================================
function Test-NetworkConnectivity {
    Write-Log "DEBUG" "Testing network connectivity..."
    try {
        $response = Invoke-WebRequest -Uri "https://storage.googleapis.com" -Method Head -TimeoutSec 10 -UseBasicParsing
        return $true
    } catch {
        Write-Err "Cannot reach download server. Check your network connection."
        Write-Err "If behind a proxy, configure system proxy settings."
        return $false
    }
}

function Get-FileChecksum {
    param([string]$FilePath)
    $hash = Get-FileHash -Path $FilePath -Algorithm SHA256
    return $hash.Hash.ToLower()
}

function Download-File {
    param(
        [string]$Url,
        [string]$OutputPath = $null,
        [int]$MaxRetries = 3
    )

    $attempt = 0
    $delay = 2

    while ($attempt -lt $MaxRetries) {
        $attempt++
        if ($attempt -gt 1) {
            Write-Warn "Download attempt $attempt/$MaxRetries (retrying in ${delay}s)..."
            Start-Sleep -Seconds $delay
            $delay = $delay * 2
        }

        try {
            Write-Log "DEBUG" "Downloading: $Url (attempt $attempt/$MaxRetries)"

            if ($OutputPath) {
                Invoke-WebRequest -Uri $Url -OutFile $OutputPath -UseBasicParsing -TimeoutSec 300
                return $true
            } else {
                $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 60
                return $response.Content
            }
        } catch {
            Write-Log "DEBUG" "Attempt $attempt failed: $_"
        }
    }

    return $false
}

function Get-InstalledVersion {
    $claudePath = Get-Command "claude" -ErrorAction SilentlyContinue
    if ($claudePath) {
        try {
            $versionOutput = & claude --version 2>&1
            if ($versionOutput -match '(\d+\.\d+\.\d+)') {
                return $Matches[1]
            }
        } catch {}
    }
    return $null
}

function Add-ToUserPath {
    param([string]$Directory)
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($currentPath -notlike "*$Directory*") {
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$Directory", "User")
        Write-Success "Added $Directory to user PATH"
        Write-Info "Restart your terminal for PATH changes to take effect."
    }
}

# ============================================================================
# Core Functions
# ============================================================================
function Install-ClaudeCode {
    $startTime = Get-Date

    # Show banner
    if (-not $Quiet) {
        Write-Host ""
        Write-Host "   _____ _                 _         ____          _" -ForegroundColor Cyan
        Write-Host "  / ____| |               | |       / ___|___   __| | ___" -ForegroundColor Cyan
        Write-Host " | |    | | __ _ _   _  __| | ___  | |   / _ \ / _  |/ _ " -ForegroundColor Cyan
        Write-Host " | |    | |/ _  | | | |/ _  |/ _ \ | |__| (_) | (_| |  __/" -ForegroundColor Cyan
        Write-Host "  \____|_|\__,_|\__,_|\__,_|\___/  \____\___/ \__,_|\___|" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  Windows Installer v2.0.0" -ForegroundColor DarkGray
        Write-Host ""
    }

    # Pre-flight checks
    Write-Step "Pre-flight checks"

    # Check Windows version
    $osVersion = [Environment]::OSVersion.Version
    if ($osVersion.Major -lt 10) {
        Write-Err "Windows 10 or later is required."
        exit 1
    }
    Write-Log "DEBUG" "Windows version: $osVersion"

    # Check architecture
    if (-not [Environment]::Is64BitOperatingSystem) {
        Write-Err "64-bit Windows is required."
        exit 1
    }

    # Create directories
    @($INSTALL_DIR, $BIN_DIR, $DOWNLOAD_DIR, $LOG_DIR) | ForEach-Object {
        if (-not (Test-Path $_)) { New-Item -ItemType Directory -Path $_ -Force | Out-Null }
    }

    # Network check
    if (-not (Test-NetworkConnectivity)) { exit 1 }

    # Check disk space (100MB minimum)
    $drive = (Split-Path $INSTALL_DIR -Qualifier)
    $freeSpace = (Get-PSDrive ($drive -replace ':','')).Free
    if ($freeSpace -and $freeSpace -lt 100MB) {
        Write-Err "Insufficient disk space. Need 100MB, only $([math]::Round($freeSpace/1MB))MB available."
        exit 1
    }

    Write-Success "All pre-flight checks passed"

    # Detect platform
    Write-Step "Detecting platform"
    $arch = if ([Environment]::Is64BitProcess) { "x64" } else { "x64" }  # Windows is always x64 for Claude
    $platform = "win32-$arch"
    Write-Success "Platform: Windows $arch ($platform)"

    # Resolve version
    Write-Step "Resolving version"
    $latestVersion = Download-File -Url "$GCS_BUCKET/latest"
    if (-not $latestVersion -or $latestVersion -eq $false) {
        Write-Err "Failed to fetch latest version information."
        exit 1
    }
    $latestVersion = $latestVersion.Trim()
    Write-Log "DEBUG" "Latest version: $latestVersion"

    # Check if already installed
    $installedVersion = Get-InstalledVersion
    if ($installedVersion) {
        Write-Info "Currently installed: v$installedVersion"
        if ($installedVersion -eq $latestVersion -and -not $Force) {
            Write-Success "Already up to date (v$installedVersion). Use -Force to reinstall."
            return
        }
    }

    $targetVersion = $latestVersion
    Write-Success "Target version: v$targetVersion"

    # Download manifest
    Write-Step "Downloading Claude Code"
    Write-Info "Fetching release manifest..."
    $manifestJson = Download-File -Url "$GCS_BUCKET/$targetVersion/manifest.json"
    if (-not $manifestJson -or $manifestJson -eq $false) {
        Write-Err "Failed to download release manifest."
        exit 1
    }

    # Parse manifest for checksum
    try {
        $manifest = $manifestJson | ConvertFrom-Json
        $platformInfo = $manifest.platforms.$platform
        if (-not $platformInfo) {
            Write-Err "Platform '$platform' not found in release manifest."
            Write-Err "Windows may require a different installation method."
            Write-Err "See: https://code.claude.com/docs"
            exit 1
        }
        $expectedChecksum = $platformInfo.checksum
    } catch {
        Write-Err "Failed to parse release manifest: $_"
        exit 1
    }

    # Download binary
    $binaryPath = Join-Path $DOWNLOAD_DIR "claude-$targetVersion-$platform.exe"
    $downloadUrl = "$GCS_BUCKET/$targetVersion/$platform/claude.exe"
    Write-Info "Downloading from: $downloadUrl"

    $downloadResult = Download-File -Url $downloadUrl -OutputPath $binaryPath
    if (-not $downloadResult) {
        Remove-Item -Path $binaryPath -Force -ErrorAction SilentlyContinue
        Write-Err "Download failed. Check your network connection and try again."
        exit 1
    }

    # Verify checksum
    if (-not $NoVerify) {
        Write-Step "Verifying integrity"
        $actualChecksum = Get-FileChecksum -FilePath $binaryPath

        if ($actualChecksum -ne $expectedChecksum) {
            Remove-Item -Path $binaryPath -Force
            Write-Err "Checksum verification FAILED!"
            Write-Err "Expected: $expectedChecksum"
            Write-Err "Actual:   $actualChecksum"
            exit 1
        }
        Write-Success "Checksum verified (SHA-256)"
    } else {
        Write-Warn "Checksum verification SKIPPED (not recommended)"
    }

    # Install
    Write-Step "Installing Claude Code"
    $finalPath = Join-Path $BIN_DIR "claude.exe"
    Copy-Item -Path $binaryPath -Destination $finalPath -Force
    Write-Success "Binary installed to: $finalPath"

    # Run Claude's own install routine
    Write-Info "Running Claude Code setup..."
    try {
        & $finalPath install 2>&1 | ForEach-Object { Write-Log "INSTALL" $_ }
    } catch {
        Write-Warn "Claude setup command returned an error. The binary is installed but shell integration may need manual setup."
    }

    # Add to PATH
    Add-ToUserPath -Directory $BIN_DIR

    # Cleanup
    Remove-Item -Path $binaryPath -Force -ErrorAction SilentlyContinue

    # Summary
    $elapsed = (Get-Date) - $startTime
    Write-Host ""
    Write-Host "  ============================================================" -ForegroundColor Green
    Write-Host "    Installation complete!                                     " -ForegroundColor Green
    Write-Host "  ============================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Version:   v$targetVersion"
    Write-Host "  Platform:  Windows $arch"
    Write-Host "  Location:  $finalPath"
    Write-Host ""
    Write-Host "  Quick Start:" -ForegroundColor White
    Write-Host "    claude            Open Claude Code" -ForegroundColor Cyan
    Write-Host "    claude --help     Show available commands" -ForegroundColor Cyan
    Write-Host "    claude update     Check for updates" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Tip: Restart your terminal for PATH changes to take effect." -ForegroundColor Yellow
    Write-Host "  Log: $LOG_FILE" -ForegroundColor DarkGray
    Write-Host ""
}

function Uninstall-ClaudeCode {
    Write-Step "Uninstalling Claude Code"

    # Remove binary
    $claudeExe = Join-Path $BIN_DIR "claude.exe"
    if (Test-Path $claudeExe) {
        Remove-Item -Path $claudeExe -Force
        Write-Info "Removed: $claudeExe"
    }

    # Remove from PATH
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $newPath = ($currentPath -split ";" | Where-Object { $_ -ne $BIN_DIR -and $_ -ne $INSTALL_DIR }) -join ";"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Info "Removed from PATH"

    # Remove directories
    if (Test-Path $INSTALL_DIR) {
        Remove-Item -Path $INSTALL_DIR -Recurse -Force
        Write-Info "Removed: $INSTALL_DIR"
    }

    Write-Success "Claude Code has been uninstalled."
}

function Check-ForUpdates {
    Write-Step "Checking for updates"

    $installedVersion = Get-InstalledVersion
    $latestVersion = (Download-File -Url "$GCS_BUCKET/latest")
    if ($latestVersion) { $latestVersion = $latestVersion.Trim() }

    if (-not $installedVersion) {
        Write-Info "Claude Code is not currently installed."
        Write-Info "Latest available: v$latestVersion"
    } elseif ($installedVersion -eq $latestVersion) {
        Write-Success "You are running the latest version: v$installedVersion"
    } else {
        Write-Info "Installed: v$installedVersion"
        Write-Info "Latest:    v$latestVersion"
        Write-Info "Run with -Action install to update."
    }
}

# ============================================================================
# Main Entry Point
# ============================================================================
switch ($Action) {
    "install"      { Install-ClaudeCode }
    "update"       { $Force = $true; Install-ClaudeCode }
    "uninstall"    { Uninstall-ClaudeCode }
    "check-update" { Check-ForUpdates }
    "launch"       {
        $claudeExe = Join-Path $BIN_DIR "claude.exe"
        if (Test-Path $claudeExe) {
            & $claudeExe $args
        } else {
            Write-Err "Claude Code is not installed. Run with -Action install first."
            exit 1
        }
    }
}