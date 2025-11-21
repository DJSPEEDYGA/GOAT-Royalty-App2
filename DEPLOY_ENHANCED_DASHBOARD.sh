#!/bin/bash

# GOAT Royalty App - Enhanced Dashboard Deployment Script
# Server: 93.127.214.171:3000
# Branch: feature/complete-platform

echo "🚀 GOAT Royalty App - Enhanced Dashboard Deployment"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Server details
SERVER_IP="93.127.214.171"
APP_DIR="/var/www/goat-royalty-app"
BRANCH="feature/complete-platform"

echo -e "${BLUE}📦 Step 1: Pulling latest changes from GitHub...${NC}"
cd $APP_DIR
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH

echo ""
echo -e "${BLUE}📦 Step 2: Installing dependencies...${NC}"
npm install

echo ""
echo -e "${BLUE}🔨 Step 3: Building application...${NC}"
npm run build

echo ""
echo -e "${BLUE}🔄 Step 4: Restarting PM2 process...${NC}"
pm2 restart goat-royalty-app
pm2 save

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "🌐 Your enhanced dashboard is now live at:"
echo "   http://$SERVER_IP:3000"
echo ""
echo "📊 New Features Available:"
echo "   ✓ Comprehensive sidebar navigation"
echo "   ✓ Platform performance tracking"
echo "   ✓ Top performing tracks"
echo "   ✓ Recent activity feed"
echo "   ✓ Enhanced analytics"
echo "   ✓ Quick action buttons"
echo ""
echo "🎯 Access the enhanced dashboard at:"
echo "   http://$SERVER_IP:3000/dashboard"
echo "   http://$SERVER_IP:3000/enhanced-dashboard"
echo ""