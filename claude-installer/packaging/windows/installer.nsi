; ============================================================================
; Claude Code Installer — NSIS Script
; ============================================================================
; Build with: makensis installer.nsi
; Requires: NSIS 3.x (https://nsis.sourceforge.io)
; ============================================================================

!include "MUI2.nsh"
!include "FileFunc.nsh"
!include "LogicLib.nsh"
!include "WinVer.nsh"
!include "x64.nsh"

; ============================================================================
; INSTALLER METADATA
; ============================================================================
!define PRODUCT_NAME        "Claude Code"
!define PRODUCT_VERSION     "2.0.0"
!define PRODUCT_PUBLISHER   "Anthropic"
!define PRODUCT_WEB_SITE    "https://code.claude.com"
!define PRODUCT_DOCS        "https://code.claude.com/docs"
!define PRODUCT_UNINST_KEY  "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_DIR_REGKEY  "Software\ClaudeCode"

; Installer output filename
OutFile "..\..\build\ClaudeCode-Setup-${PRODUCT_VERSION}.exe"

; Default installation directory
InstallDir "$LOCALAPPDATA\Programs\ClaudeCode"
InstallDirRegKey HKCU "${PRODUCT_DIR_REGKEY}" "InstallDir"

; Request user-level privileges (no admin needed)
RequestExecutionLevel user

; Compression
SetCompressor /SOLID lzma
SetCompressorDictSize 64

; Version info embedded in the .exe
VIProductVersion "${PRODUCT_VERSION}.0"
VIAddVersionKey "ProductName"     "${PRODUCT_NAME}"
VIAddVersionKey "CompanyName"     "${PRODUCT_PUBLISHER}"
VIAddVersionKey "LegalCopyright"  "Copyright (c) ${PRODUCT_PUBLISHER}"
VIAddVersionKey "FileDescription" "${PRODUCT_NAME} Installer"
VIAddVersionKey "FileVersion"     "${PRODUCT_VERSION}"
VIAddVersionKey "ProductVersion"  "${PRODUCT_VERSION}"

; ============================================================================
; MODERN UI CONFIGURATION
; ============================================================================
!define MUI_ABORTWARNING
!define MUI_ICON   "..\..\assets\claude-icon.ico"
!define MUI_UNICON "..\..\assets\claude-icon.ico"

; Header image (150x57 recommended)
; !define MUI_HEADERIMAGE
; !define MUI_HEADERIMAGE_BITMAP "..\..\assets\header.bmp"

; Welcome page configuration
!define MUI_WELCOMEPAGE_TITLE "Welcome to ${PRODUCT_NAME} Setup"
!define MUI_WELCOMEPAGE_TEXT "This wizard will guide you through the installation of ${PRODUCT_NAME} v${PRODUCT_VERSION}.$\r$\n$\r$\n${PRODUCT_NAME} is an AI-powered coding assistant for your terminal.$\r$\n$\r$\nClick Next to continue."

; Finish page configuration
!define MUI_FINISHPAGE_TITLE "Installation Complete"
!define MUI_FINISHPAGE_TEXT "${PRODUCT_NAME} has been installed successfully.$\r$\n$\r$\nYou can launch Claude Code from your terminal by typing: claude$\r$\n$\r$\nClick Finish to close this wizard."
!define MUI_FINISHPAGE_RUN ""
!define MUI_FINISHPAGE_RUN_TEXT "Open documentation in browser"
!define MUI_FINISHPAGE_RUN_FUNCTION "OpenDocs"
!define MUI_FINISHPAGE_SHOWREADME ""
!define MUI_FINISHPAGE_SHOWREADME_TEXT "Add Claude to PATH"
!define MUI_FINISHPAGE_SHOWREADME_FUNCTION "AddToPath"
!define MUI_FINISHPAGE_SHOWREADME_CHECKED

; ============================================================================
; INSTALLER PAGES
; ============================================================================
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "..\..\LICENSE.txt"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Language
!insertmacro MUI_LANGUAGE "English"

; ============================================================================
; INSTALLER SECTIONS
; ============================================================================
Section "Claude Code (required)" SEC_MAIN
    SectionIn RO  ; Read-only, always installed

    ; Set output path to the installation directory
    SetOutPath "$INSTDIR"

    ; ---- Pre-install checks ----
    ; Check Windows version (Windows 10+ required)
    ${IfNot} ${AtLeastWin10}
        MessageBox MB_OK|MB_ICONSTOP "Windows 10 or later is required."
        Abort
    ${EndIf}

    ; Check architecture
    ${If} ${RunningX64}
        DetailPrint "Detected 64-bit Windows"
    ${Else}
        MessageBox MB_OK|MB_ICONSTOP "64-bit Windows is required."
        Abort
    ${EndIf}

    ; ---- Install files ----
    DetailPrint "Installing Claude Code..."

    ; Copy the main installer script (bash)
    File "..\..\scripts\install-claude.sh"

    ; Copy the Windows wrapper/bootstrap
    File "claude-wrapper.cmd"
    File "claude.ps1"

    ; Copy assets
    File /oname=claude-icon.ico "..\..\assets\claude-icon.ico"

    ; Create README
    File "..\..\README.md"

    ; ---- Download and install Claude binary ----
    DetailPrint "Downloading Claude Code binary..."
    ; Use PowerShell to run the installation
    nsExec::ExecToLog 'powershell.exe -ExecutionPolicy Bypass -File "$INSTDIR\claude.ps1" -Action install'
    Pop $0
    ${If} $0 != 0
        DetailPrint "Warning: Automatic download may have failed. You can run claude.ps1 manually."
    ${EndIf}

    ; ---- Write registry keys ----
    WriteRegStr HKCU "${PRODUCT_DIR_REGKEY}" "InstallDir" "$INSTDIR"
    WriteRegStr HKCU "${PRODUCT_DIR_REGKEY}" "Version" "${PRODUCT_VERSION}"

    ; Uninstaller registry
    WriteRegStr   HKCU "${PRODUCT_UNINST_KEY}" "DisplayName"     "${PRODUCT_NAME}"
    WriteRegStr   HKCU "${PRODUCT_UNINST_KEY}" "UninstallString" '"$INSTDIR\uninstall.exe"'
    WriteRegStr   HKCU "${PRODUCT_UNINST_KEY}" "DisplayIcon"     "$INSTDIR\claude-icon.ico"
    WriteRegStr   HKCU "${PRODUCT_UNINST_KEY}" "DisplayVersion"  "${PRODUCT_VERSION}"
    WriteRegStr   HKCU "${PRODUCT_UNINST_KEY}" "Publisher"       "${PRODUCT_PUBLISHER}"
    WriteRegStr   HKCU "${PRODUCT_UNINST_KEY}" "URLInfoAbout"    "${PRODUCT_WEB_SITE}"
    WriteRegDWORD HKCU "${PRODUCT_UNINST_KEY}" "NoModify"        1
    WriteRegDWORD HKCU "${PRODUCT_UNINST_KEY}" "NoRepair"        1

    ; Calculate installed size
    ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
    IntFmt $0 "0x%08X" $0
    WriteRegDWORD HKCU "${PRODUCT_UNINST_KEY}" "EstimatedSize" "$0"

    ; Create uninstaller
    WriteUninstaller "$INSTDIR\uninstall.exe"

    DetailPrint "Installation complete!"
SectionEnd

; Optional: Start Menu shortcuts
Section "Start Menu Shortcuts" SEC_STARTMENU
    CreateDirectory "$SMPROGRAMS\${PRODUCT_NAME}"
    CreateShortcut  "$SMPROGRAMS\${PRODUCT_NAME}\Claude Code.lnk"   "$INSTDIR\claude-wrapper.cmd" "" "$INSTDIR\claude-icon.ico"
    CreateShortcut  "$SMPROGRAMS\${PRODUCT_NAME}\Documentation.lnk" "${PRODUCT_DOCS}"
    CreateShortcut  "$SMPROGRAMS\${PRODUCT_NAME}\Uninstall.lnk"     "$INSTDIR\uninstall.exe"
SectionEnd

; ============================================================================
; UNINSTALLER SECTION
; ============================================================================
Section "Uninstall"
    ; Remove files
    Delete "$INSTDIR\install-claude.sh"
    Delete "$INSTDIR\claude-wrapper.cmd"
    Delete "$INSTDIR\claude.ps1"
    Delete "$INSTDIR\claude-icon.ico"
    Delete "$INSTDIR\README.md"
    Delete "$INSTDIR\uninstall.exe"

    ; Remove Claude binary and data
    RMDir /r "$INSTDIR\bin"
    RMDir /r "$INSTDIR\data"

    ; Remove Start Menu shortcuts
    Delete "$SMPROGRAMS\${PRODUCT_NAME}\Claude Code.lnk"
    Delete "$SMPROGRAMS\${PRODUCT_NAME}\Documentation.lnk"
    Delete "$SMPROGRAMS\${PRODUCT_NAME}\Uninstall.lnk"
    RMDir  "$SMPROGRAMS\${PRODUCT_NAME}"

    ; Remove installation directory (only if empty)
    RMDir "$INSTDIR"

    ; Remove from PATH
    nsExec::ExecToLog 'powershell.exe -ExecutionPolicy Bypass -Command "\
        $path = [Environment]::GetEnvironmentVariable("Path", "User"); \
        $newPath = ($path -split ";" | Where-Object { $_ -ne "$INSTDIR\\bin" -and $_ -ne "$INSTDIR" }) -join ";"; \
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")"'

    ; Remove registry keys
    DeleteRegKey HKCU "${PRODUCT_UNINST_KEY}"
    DeleteRegKey HKCU "${PRODUCT_DIR_REGKEY}"

    DetailPrint "Claude Code has been uninstalled."
SectionEnd

; ============================================================================
; CALLBACK FUNCTIONS
; ============================================================================
Function .onInit
    ; Check for existing installation
    ReadRegStr $0 HKCU "${PRODUCT_DIR_REGKEY}" "Version"
    ${If} $0 != ""
        MessageBox MB_YESNO|MB_ICONQUESTION \
            "${PRODUCT_NAME} v$0 is already installed.$\r$\n$\r$\nDo you want to upgrade to v${PRODUCT_VERSION}?" \
            IDYES continue
        Abort
        continue:
    ${EndIf}
FunctionEnd

Function OpenDocs
    ExecShell "open" "${PRODUCT_DOCS}"
FunctionEnd

Function AddToPath
    ; Add installation directory to user PATH
    nsExec::ExecToLog 'powershell.exe -ExecutionPolicy Bypass -Command "\
        $installDir = "$INSTDIR\bin"; \
        $path = [Environment]::GetEnvironmentVariable("Path", "User"); \
        if ($path -notlike "*$installDir*") { \
            [Environment]::SetEnvironmentVariable("Path", "$path;$installDir", "User"); \
            Write-Host "Added $installDir to PATH" \
        }"'
    ; Notify running applications of the PATH change
    SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
FunctionEnd