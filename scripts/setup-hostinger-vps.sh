#!/bin/bash

# GOAT Royalty App - Hostinger VPS Setup Script
# This script automates the initial setup of your Hostinger VPS

set -e  # Exit on error

echo "=================================="
echo "GOAT Royalty App VPS Setup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root (use sudo)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Running as root${NC}"
echo ""

# Get user input
read -p "Enter your domain name (e.g., goat-app.com): " DOMAIN
read -p "Enter your email for SSL certificate: " EMAIL
read -p "Enter GitHub repository URL: " REPO_URL

echo ""
echo "Configuration:"
echo "  Domain: $DOMAIN"
echo "  Email: $EMAIL"
echo "  Repository: $REPO_URL"
echo ""
read -p "Is this correct? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "Setup cancelled"
    exit 1
fi

echo ""
echo "=================================="
echo "Step 1: System Update"
echo "=================================="
apt update && apt upgrade -y
echo -e "${GREEN}✅ System updated${NC}"

echo ""
echo "=================================="
echo "Step 2: Install Node.js 20.x"
echo "=================================="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
echo -e "${GREEN}✅ Node.js installed: $(node --version)${NC}"

echo ""
echo "=================================="
echo "Step 3: Install PM2"
echo "=================================="
npm install -g pm2
echo -e "${GREEN}✅ PM2 installed: $(pm2 --version)${NC}"

echo ""
echo "=================================="
echo "Step 4: Install Nginx"
echo "=================================="
apt install -y nginx
systemctl enable nginx
systemctl start nginx
echo -e "${GREEN}✅ Nginx installed and started${NC}"

echo ""
echo "=================================="
echo "Step 5: Install Certbot"
echo "=================================="
apt install -y certbot python3-certbot-nginx
echo -e "${GREEN}✅ Certbot installed${NC}"

echo ""
echo "=================================="
echo "Step 6: Configure Firewall"
echo "=================================="
ufw --force enable
ufw allow OpenSSH
ufw allow 'Nginx Full'
echo -e "${GREEN}✅ Firewall configured${NC}"

echo ""
echo "=================================="
echo "Step 7: Clone Repository"
echo "=================================="
mkdir -p /var/www
cd /var/www

if [ -d "GOAT-Royalty-App2" ]; then
    echo -e "${YELLOW}⚠️  Directory exists, pulling latest changes${NC}"
    cd GOAT-Royalty-App2
    git pull
else
    git clone $REPO_URL
    cd GOAT-Royalty-App2
fi
echo -e "${GREEN}✅ Repository cloned${NC}"

echo ""
echo "=================================="
echo "Step 8: Install Dependencies"
echo "=================================="
npm install --production
echo -e "${GREEN}✅ Dependencies installed${NC}"

echo ""
echo "=================================="
echo "Step 9: Configure Environment"
echo "=================================="
cat > .env.production << EOF
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://$DOMAIN
PORT=3000
EOF
echo -e "${YELLOW}⚠️  Please edit /var/www/GOAT-Royalty-App2/.env.production and add your API keys${NC}"

echo ""
echo "=================================="
echo "Step 10: Build Application"
echo "=================================="
npm run build
echo -e "${GREEN}✅ Application built${NC}"

echo ""
echo "=================================="
echo "Step 11: Configure PM2"
echo "=================================="
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'goat-royalty-app',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/GOAT-Royalty-App2',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -n 1 | bash
echo -e "${GREEN}✅ PM2 configured and application started${NC}"

echo ""
echo "=================================="
echo "Step 12: Configure Nginx"
echo "=================================="
cat > /etc/nginx/sites-available/goat-royalty-app << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    client_max_body_size 50M;
}
EOF

ln -sf /etc/nginx/sites-available/goat-royalty-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
echo -e "${GREEN}✅ Nginx configured${NC}"

echo ""
echo "=================================="
echo "Step 13: Install SSL Certificate"
echo "=================================="
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL
echo -e "${GREEN}✅ SSL certificate installed${NC}"

echo ""
echo "=================================="
echo "Step 14: Create Management Scripts"
echo "=================================="

# Deploy script
cat > /root/deploy.sh << 'EOFSCRIPT'
#!/bin/bash
echo "🚀 Deploying GOAT Royalty App..."
cd /var/www/GOAT-Royalty-App2
git pull origin main
npm install --production
npm run build
pm2 restart goat-royalty-app
pm2 save
echo "✅ Deployment complete!"
EOFSCRIPT

# Backup script
cat > /root/backup.sh << 'EOFSCRIPT'
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/goat-app-$DATE.tar.gz /var/www/GOAT-Royalty-App2
tar -czf $BACKUP_DIR/nginx-config-$DATE.tar.gz /etc/nginx
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
echo "✅ Backup complete: $BACKUP_DIR"
EOFSCRIPT

# Monitor script
cat > /root/monitor.sh << 'EOFSCRIPT'
#!/bin/bash
if ! pm2 list | grep -q "goat-royalty-app.*online"; then
    echo "❌ Application is down! Restarting..."
    pm2 restart goat-royalty-app
fi
EOFSCRIPT

chmod +x /root/deploy.sh
chmod +x /root/backup.sh
chmod +x /root/monitor.sh

echo -e "${GREEN}✅ Management scripts created${NC}"

echo ""
echo "=================================="
echo "Step 15: Setup Cron Jobs"
echo "=================================="
(crontab -l 2>/dev/null; echo "0 2 * * * /root/deploy.sh >> /var/log/deploy.log 2>&1") | crontab -
(crontab -l 2>/dev/null; echo "0 3 * * * /root/backup.sh >> /var/log/backup.log 2>&1") | crontab -
(crontab -l 2>/dev/null; echo "*/5 * * * * /root/monitor.sh >> /var/log/monitor.log 2>&1") | crontab -
echo -e "${GREEN}✅ Cron jobs configured${NC}"

echo ""
echo "=================================="
echo "✅ Setup Complete!"
echo "=================================="
echo ""
echo "Your GOAT Royalty App is now deployed at:"
echo -e "${GREEN}https://$DOMAIN${NC}"
echo ""
echo "Important Next Steps:"
echo "1. Edit environment variables: nano /var/www/GOAT-Royalty-App2/.env.production"
echo "2. Add your API keys (OpenAI, Google, SuperNinja)"
echo "3. Restart the application: pm2 restart goat-royalty-app"
echo "4. Check application status: pm2 status"
echo "5. View logs: pm2 logs goat-royalty-app"
echo ""
echo "Management Commands:"
echo "  Deploy updates: /root/deploy.sh"
echo "  Create backup: /root/backup.sh"
echo "  Check monitoring: /root/monitor.sh"
echo ""
echo "Useful Commands:"
echo "  pm2 status              - Check application status"
echo "  pm2 logs                - View application logs"
echo "  pm2 restart all         - Restart all applications"
echo "  nginx -t                - Test Nginx configuration"
echo "  systemctl reload nginx  - Reload Nginx"
echo "  certbot renew          - Renew SSL certificate"
echo ""
echo "=================================="