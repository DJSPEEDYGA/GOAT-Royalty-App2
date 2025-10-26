#!/bin/bash

#############################################
# GOAT Royalty App - Hostinger VPS Deployment
# Automated Setup Script
#############################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="goat-royalty-app"
APP_DIR="/var/www/GOAT-Royalty-App2"
REPO_URL="https://github.com/DJSPEEDYGA/GOAT-Royalty-App2.git"
BRANCH="feature/advanced-camera-sora2-integration"
NODE_VERSION="20"
APP_PORT="3000"
DOMAIN="${1:-localhost}"  # Use first argument as domain, or localhost

echo -e "${BLUE}"
echo "=========================================="
echo "  GOAT Royalty App - Hostinger Deployment"
echo "=========================================="
echo -e "${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}[ERROR] Please run as root (use sudo)${NC}"
    exit 1
fi

echo -e "${GREEN}[1/10] Updating system packages...${NC}"
apt update && apt upgrade -y

echo -e "${GREEN}[2/10] Installing required packages...${NC}"
apt install -y curl wget git build-essential nginx ufw certbot python3-certbot-nginx

echo -e "${GREEN}[3/10] Installing Node.js ${NODE_VERSION}.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt install -y nodejs

echo -e "${GREEN}[4/10] Installing PM2 process manager...${NC}"
npm install -g pm2

echo -e "${GREEN}[5/10] Configuring firewall...${NC}"
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw status

echo -e "${GREEN}[6/10] Cloning application from GitHub...${NC}"
if [ -d "$APP_DIR" ]; then
    echo -e "${YELLOW}Directory exists, pulling latest changes...${NC}"
    cd "$APP_DIR"
    git pull origin "$BRANCH"
else
    git clone -b "$BRANCH" "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

echo -e "${GREEN}[7/10] Installing application dependencies...${NC}"
npm install --legacy-peer-deps

echo -e "${GREEN}[8/10] Building application for production...${NC}"
npm run build

echo -e "${GREEN}[9/10] Setting up PM2 process manager...${NC}"
pm2 delete "$APP_NAME" 2>/dev/null || true
pm2 start npm --name "$APP_NAME" -- start
pm2 save
pm2 startup systemd -u root --hp /root

echo -e "${GREEN}[10/10] Configuring Nginx reverse proxy...${NC}"

# Create Nginx configuration
cat > /etc/nginx/sites-available/$APP_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

echo -e "${BLUE}"
echo "=========================================="
echo "  ✅ DEPLOYMENT COMPLETE!"
echo "=========================================="
echo -e "${NC}"

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)

echo -e "${GREEN}Application Status:${NC}"
pm2 list

echo ""
echo -e "${GREEN}Access URLs:${NC}"
echo -e "  Local:    http://localhost:$APP_PORT"
echo -e "  Public:   http://$SERVER_IP"
if [ "$DOMAIN" != "localhost" ]; then
    echo -e "  Domain:   http://$DOMAIN"
fi

echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Test the application: curl http://localhost:$APP_PORT"
echo "  2. Check PM2 status: pm2 status"
echo "  3. View logs: pm2 logs $APP_NAME"
echo "  4. Monitor: pm2 monit"

if [ "$DOMAIN" != "localhost" ]; then
    echo ""
    echo -e "${YELLOW}To enable HTTPS (SSL):${NC}"
    echo "  sudo certbot --nginx -d $DOMAIN"
fi

echo ""
echo -e "${GREEN}Useful Commands:${NC}"
echo "  pm2 restart $APP_NAME    # Restart app"
echo "  pm2 stop $APP_NAME       # Stop app"
echo "  pm2 logs $APP_NAME       # View logs"
echo "  pm2 monit                # Monitor resources"
echo "  systemctl status nginx   # Check Nginx status"
echo "  nginx -t                 # Test Nginx config"

echo ""
echo -e "${BLUE}=========================================="
echo "  GOAT Royalty Force - LIVE! 🚀"
echo "=========================================="
echo -e "${NC}"