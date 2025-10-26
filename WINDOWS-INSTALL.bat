@echo off
echo ========================================
echo GOAT Royalty App - Windows Installation
echo ========================================
echo.

REM Check if Git is configured
echo Checking Git configuration...
git config --global user.email >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] Git user.email is not configured!
    echo Please run these commands first:
    echo   git config --global user.email "your-email@example.com"
    echo   git config --global user.name "Your Name"
    echo.
    pause
    exit /b 1
)

echo [OK] Git is configured
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

REM Check if npm is installed
echo Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

echo [OK] npm is installed
npm --version
echo.

REM Clean previous installation
echo Cleaning previous installation...
if exist node_modules (
    echo Removing old node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    echo Removing old package-lock.json...
    del /f package-lock.json
)
if exist .next (
    echo Removing old .next build...
    rmdir /s /q .next
)
echo [OK] Cleanup complete
echo.

REM Install dependencies
echo Installing dependencies (this may take a few minutes)...
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed!
    echo Try running: npm cache clean --force
    echo Then run this script again.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Installation complete!
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo Then open your browser to: http://localhost:3000
echo.
pause