@echo off
REM SUPER GOAT ROYALTIES APP - Windows Installer Script
REM This script installs the portable version on Windows

setlocal enabledelayedexpansion
set APP_NAME=SUPER GOAT ROYALTIES APP
set APP_VERSION=1.0.0
set INSTALL_DIR=%LOCALAPPDATA%\SuperGoatRoyalties

echo ============================================
echo   %APP_NAME% v%APP_VERSION% Installer
echo ============================================
echo.

REM Check for admin rights (optional but recommended)
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [INFO] Running with administrator privileges
    set INSTALL_DIR=%ProgramFiles%\SuperGoatRoyalties
) else (
    echo [INFO] Running without admin rights - installing to user directory
)

REM Create installation directory
echo [1/4] Creating installation directory...
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

REM Copy files
echo [2/4] Copying application files...
xcopy /E /I /Y "%~dp0SUPER-GOAT-ROYALTIES-Portable" "%INSTALL_DIR%\app" >nul

REM Create desktop shortcut
echo [3/4] Creating shortcuts...
set SHORTCUT_TARGET=%INSTALL_DIR%\app\Start-Windows.bat
powershell -Command "$WS = New-Object -ComObject WScript.Shell; $SC = $WS.CreateShortcut('%USERPROFILE%\Desktop\%APP_NAME%.lnk'); $SC.TargetPath = '%SHORTCUT_TARGET%'; $SC.WorkingDirectory = '%INSTALL_DIR%\app'; $SC.Save()"

REM Create Start Menu shortcut
set START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs
if not exist "%START_MENU%" mkdir "%START_MENU%"
powershell -Command "$WS = New-Object -ComObject WScript.Shell; $SC = $WS.CreateShortcut('%START_MENU%\%APP_NAME%.lnk'); $SC.TargetPath = '%SHORTCUT_TARGET%'; $SC.WorkingDirectory = '%INSTALL_DIR%\app'; $SC.Save()"

REM Create uninstaller
echo [4/4] Creating uninstaller...
echo @echo off > "%INSTALL_DIR%\uninstall.bat"
echo echo Uninstalling %APP_NAME%... >> "%INSTALL_DIR%\uninstall.bat"
echo rmdir /S /Q "%INSTALL_DIR%\app" >> "%INSTALL_DIR%\uninstall.bat"
echo del "%%USERPROFILE%%\Desktop\%APP_NAME%.lnk" 2^^>nul >> "%INSTALL_DIR%\uninstall.bat"
echo del "%%APPDATA%%\Microsoft\Windows\Start Menu\Programs\%APP_NAME%.lnk" 2^^>nul >> "%INSTALL_DIR%\uninstall.bat"
echo echo %APP_NAME% has been uninstalled. >> "%INSTALL_DIR%\uninstall.bat"
echo pause >> "%INSTALL_DIR%\uninstall.bat"

echo.
echo ============================================
echo   Installation Complete!
echo ============================================
echo.
echo Installation directory: %INSTALL_DIR%
echo.
echo To start the application:
echo   - Double-click the desktop shortcut, or
echo   - Run: %INSTALL_DIR%\app\Start-Windows.bat
echo.
echo To uninstall:
echo   - Run: %INSTALL_DIR%\uninstall.bat
echo.
pause