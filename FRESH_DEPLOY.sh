#!/bin/bash

# GOAT Royalty App - Fresh Deployment Script
# This script will set up the app from scratch on your VPS

echo "🚀 GOAT Royalty App - Fresh Deployment"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/goat-royalty-app"
REPO_URL="https://github.com/DJSPEEDYGA/GOAT-Royalty-App2.git"
BRANCH="feature/complete-platform"

echo -e "${BLUE}📦 Step 1: Backing up existing directory...${NC}"
if [ -d "$APP_DIR" ]; then
    mv $APP_DIR ${APP_DIR}-backup-$(date +%Y%m%d-%H%M%S)
    echo -e "${GREEN}✓ Backup created${NC}"
fi

echo ""
echo -e "${BLUE}📥 Step 2: Cloning fresh repository...${NC}"
git clone -b $BRANCH $REPO_URL $APP_DIR
cd $APP_DIR

echo ""
echo -e "${BLUE}📦 Step 3: Installing dependencies...${NC}"
npm install

echo ""
echo -e "${BLUE}🔨 Step 4: Building application...${NC}"
npm run build

echo ""
echo -e "${BLUE}🔄 Step 5: Setting up PM2...${NC}"
pm2 delete goat-royalty-app 2>/dev/null || true
pm2 start npm --name "goat-royalty-app" -- start
pm2 save

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "🌐 Your app is now live at:"
echo "   http://93.127.214.171:3000"
echo ""
echo "📊 New Features Available:"
echo "   ✓ Enhanced Dashboard: /dashboard"
echo "   ✓ Music Catalog: /catalog"
echo "   ✓ Advanced Analytics: /advanced-analytics"
echo "   ✓ AI Studio: /ai-studio"
echo ""
echo "🔍 Check PM2 status:"
pm2 status
echo ""
echo "📝 View logs:"
echo "   pm2 logs goat-royalty-app"
echo ""