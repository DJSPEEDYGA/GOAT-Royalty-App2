@echo off
:: ============================================================================
:: Claude Code — Windows CMD Wrapper
:: ============================================================================
:: This wrapper allows launching Claude Code from the Windows command prompt.
:: It locates the Claude binary and forwards all arguments to it.
:: ============================================================================

setlocal EnableDelayedExpansion

:: Determine installation directory (same directory as this script)
set "SCRIPT_DIR=%~dp0"
set "CLAUDE_BIN=%SCRIPT_DIR%bin\claude.exe"

:: Check if Claude binary exists
if not exist "%CLAUDE_BIN%" (
    echo.
    echo  Claude Code is not installed or the binary is missing.
    echo  Expected location: %CLAUDE_BIN%
    echo.
    echo  To install, run:
    echo    powershell -ExecutionPolicy Bypass -File "%SCRIPT_DIR%claude.ps1" -Action install
    echo.
    exit /b 1
)

:: Forward all arguments to the Claude binary
"%CLAUDE_BIN%" %*
exit /b %ERRORLEVEL%