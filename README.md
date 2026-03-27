# 🐐⚡ Super GOAT Royalty App

> **The Ultimate AI-Powered Music Production & Royalty Management Command Center**

Built by **Harvey Miller (DJ Speedy)** — merging the power of GOAT Royalty + SuperNinja AI into one unified platform.

---

## 🚀 What is Super GOAT Royalty?

Super GOAT Royalty is a full-stack music industry platform that combines AI-powered tools, royalty management, music production, browser automation, and developer tools into a single command center.

### 📊 Platform Stats
- **346 Tracks** in catalog
- **1.2B+ Total Streams** across all platforms
- **$865,420+** Estimated Royalties
- **6 Streaming Platforms** tracked (Spotify, Apple Music, YouTube, Amazon, Tidal, Deezer)
- **5 Active Automation Bots** running 24/7

---

## ⚡ Features

### 🧠 AI Command Center
- Multi-LLM support: Google Gemini, OpenAI GPT-4o, Anthropic Claude
- Context-aware music industry assistant
- Smart fallback responses when APIs are unavailable

### 💰 Royalty Calculator
- Real-time earnings across 6 streaming platforms
- Per-stream rate analysis
- Monthly growth tracking
- Pending payment alerts

### 🎵 Track Manager
- Full catalog management (346+ tracks)
- FASTASSMAN Publishing Inc (ASCAP) integration
- Harvey L Miller Writers catalog
- Stream counts, revenue, and trend analysis

### 🤖 Browser Automation (Axiom Engine)
- Spotify Playlist Scraper
- YouTube Analytics Collector
- Social Media Monitor
- Royalty Report Generator
- Copyright Infringement Scanner
- 8 pre-built bot templates

### 💻 Developer Tools
- Integrated Terminal
- Code Editor with syntax highlighting
- File Manager
- Git operations

### 📈 Streaming Analytics
- Platform-by-platform breakdown
- 30-day trend visualization
- Growth rate analysis
- Viral track detection

### 🎹 Music Production
- Active project management
- AI-assisted beat making
- Vocal processing
- Sample library (10,000+ samples)
- Mastering suite
- Stem separator
- Chord generator

### 🔒 Security & IP Protection
- Fingerprint authentication
- IP Protection Vault
- Copyright management
- NVIDIA DGX Cloud integration

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, Tailwind CSS |
| **AI** | Google Gemini, OpenAI, Anthropic Claude |
| **Database** | Supabase (PostgreSQL) |
| **Desktop** | Electron (Win/Mac/Linux) |
| **Automation** | Custom Axiom-style browser automation engine |
| **Deployment** | PM2, Ubuntu 24.04, NGINX |
| **CI/CD** | GitHub Actions |

---

## 🚀 Quick Start

### Web App (Development)
```bash
git clone https://github.com/DJSPEEDYGA/GOAT-Royalty-App2.git
cd GOAT-Royalty-App2
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) — then navigate to `/super-goat-command`

### Desktop App
```bash
cd super-ninja-app
npm install
npm start
```

### Production Deployment
```bash
npm run build
pm2 start npm --name "super-goat" -- start -- -p 3002 -H 0.0.0.0
```

---

## 📁 Project Structure

```
GOAT-Royalty-App2/
├── pages/                    # Next.js pages
│   ├── index.js              # Landing page with Super GOAT CTA
│   ├── super-goat-command.js # 🐐 Super GOAT Command Center
│   ├── dashboard.js          # Classic dashboard
│   ├── analytics.js          # Analytics page
│   ├── publishing.js         # Publishing management
│   ├── tracks.js             # Track management
│   └── api/
│       └── ai-chat.js        # Multi-LLM AI chat endpoint
├── components/
│   ├── SuperGOATCommandCenter.js  # 🐐 Main unified component
│   ├── EnhancedDashboard.js       # Enhanced dashboard
│   ├── 60+ more components...
├── styles/
│   ├── super-goat.css        # Super GOAT unified theme
│   ├── globals.css           # Global styles
│   └── animations.css        # Animation library
├── automation/               # Automation scripts
│   ├── daily-monitor.js      # Daily track monitoring
│   ├── royalty-calculator.js  # Monthly royalty calculations
│   └── social-media-monitor.js # Social media intelligence
├── super-ninja-app/          # Electron desktop app
│   ├── src/
│   │   ├── main.js           # Electron main process
│   │   ├── renderer/         # Desktop UI
│   │   └── axiom/            # Browser automation engine
│   └── package.json          # Desktop build config
└── .github/workflows/        # CI/CD pipelines
```

---

## 👥 Authors & Copyright

**© 2025 HARVEY L MILLER JR / JUAQUIN J MALPHURS / KEVIN W HALLINGQUEST**

All rights reserved. GOAT Royalty™ is a trademark of Harvey Miller (DJ Speedy).

---

## 📥 Desktop Downloads

Download the latest desktop app from [GitHub Releases](https://github.com/DJSPEEDYGA/GOAT-Royalty-App2/releases):

| Platform | File | Architecture |
|----------|------|-------------|
| 🪟 Windows | Super-GOAT-Royalty-Setup.exe | x64 |
| 🪟 Windows | Super-GOAT-Royalty-Portable.exe | x64 |
| 🍎 macOS | Super-GOAT-Royalty.zip | x64 + arm64 |
| 🐧 Linux | Super-GOAT-Royalty.AppImage | x64 |
| 🐧 Linux | Super-GOAT-Royalty.deb | x64 |

---

*Built with 🐐 energy by DJ Speedy & the GOAT Royalty team*
---

## 🔧 Claude Code Installer (Multi-Platform)

Included in the `claude-installer/` directory is a professional-grade, multi-platform installer for **Claude Code CLI** — Anthropic's AI coding assistant.

### Features
- **Enhanced Shell Installer** (991 lines) with 30+ improvements: retry logic, progress bars, colored output, proxy support, file logging, and 15+ CLI flags
- **Windows**: NSIS `.exe` installer + PowerShell script
- **macOS**: `.dmg` builder with `.app` bundle
- **Linux**: `.deb` package builder (amd64 + arm64)
- **Portable**: Cross-platform archive builder

### Quick Install (Linux/macOS)
```bash
bash claude-installer/scripts/install-claude.sh
```

### Build All Packages
```bash
cd claude-installer && bash build.sh --all
```

See [`claude-installer/README.md`](claude-installer/README.md) for full documentation.

