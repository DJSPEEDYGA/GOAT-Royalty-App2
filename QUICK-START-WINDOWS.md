# GOAT Royalty App - Quick Start Guide for Windows

## 🚀 Super Quick Start (3 Steps)

### Step 1: Configure Git (First Time Only)
Open **Git Bash** and run:
```bash
git config --global user.email "your-email@example.com"
git config --global user.name "DJ Speedy"
```
*Replace with your actual email*

### Step 2: Run the Installation Script
Double-click: **`WINDOWS-INSTALL.bat`**

This will automatically:
- Check your system requirements
- Clean old installations
- Install all dependencies
- Fix any conflicts

### Step 3: Start the App
Open **Git Bash** or **Command Prompt** in this folder and run:
```bash
npm run dev
```

Then open your browser to: **http://localhost:3000**

---

## 🔧 Manual Installation (If Script Fails)

### 1. Open Git Bash in this folder

### 2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

### 3. Start the development server:
```bash
npm run dev
```

---

## ❌ Common Errors & Fixes

### Error: "Git user.email not configured"
**Fix:**
```bash
git config --global user.email "your-email@example.com"
git config --global user.name "DJ Speedy"
```

### Error: "ERESOLVE unable to resolve dependency tree"
**Fix:**
```bash
npm install --legacy-peer-deps
```

### Error: "'next' is not recognized"
**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Error: "Port 3000 already in use"
**Fix:**
```bash
npx kill-port 3000
npm run dev
```

Or use a different port:
```bash
npm run dev -- -p 3001
```

---

## 📋 System Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Latest version
- **Windows**: 10 or 11

### Check Your Versions:
```bash
node --version
npm --version
git --version
```

---

## 🎯 What You Should See

When successful, you'll see:
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000

✓ Ready in 2.5s
```

---

## 🌟 Features Available

Once running, you'll have access to:

1. **Mission Control** - Dashboard with royalty stats
2. **Moneypenny AI** - AI-powered search assistant
3. **Codex Engine** - Global royalty tracking
4. **IP Protection Vault** - Copyright management
5. **Music Studio** - Track management
6. **Tracking Dashboard** - Analytics
7. **Cinema Camera** - Professional video recording
8. **Sora 2 AI Studio** - AI video generation
9. **SuperNinja AI** - Advanced AI features

---

## 🆘 Still Having Issues?

### Option 1: Complete Fresh Install
```bash
# Remove everything
rm -rf node_modules package-lock.json .next

# Reinstall
npm install --legacy-peer-deps

# Start
npm run dev
```

### Option 2: Use Different Package Manager
```bash
# Install pnpm
npm install -g pnpm

# Install dependencies
pnpm install

# Start
pnpm dev
```

### Option 3: Check for Port Conflicts
```bash
# See what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

---

## 📞 Need More Help?

If you're still stuck, please provide:
1. Your Node.js version: `node --version`
2. Your npm version: `npm --version`
3. The exact error message
4. Screenshot of the error (if possible)

---

## 🎉 Success Checklist

- [ ] Git configured with email and name
- [ ] Node.js and npm installed
- [ ] Dependencies installed successfully
- [ ] Development server running
- [ ] Browser showing app at localhost:3000
- [ ] All 9 tabs visible and working

---

## 💡 Pro Tips

1. **Always use Git Bash** instead of Command Prompt for better compatibility
2. **Use `--legacy-peer-deps`** flag when installing to avoid conflicts
3. **Clear npm cache** if you have persistent issues: `npm cache clean --force`
4. **Restart your terminal** after installing Node.js or npm
5. **Run as Administrator** if you get permission errors

---

## 🔄 Updating the App

To get the latest changes:
```bash
git pull origin feature/advanced-camera-sora2-integration
npm install --legacy-peer-deps
npm run dev
```

---

## 🏗️ Building for Production

To create a production build:
```bash
npm run build
npm run start
```

To create desktop executables:
```bash
npm run electron-builder
```

---

**Made with 💜 by DJ Speedy**
**GOAT Royalty Force - Truth, Justice, and Pay Us Our Money! 💰**