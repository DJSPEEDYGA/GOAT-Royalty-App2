# Deploy GOAT Royalty App to Hostinger VPS

This guide covers deploying the GOAT Royalty App as a web application on your Hostinger VPS.

## Prerequisites

- ✅ Hostinger VPS instance
- ✅ Hostinger API token
- ✅ SSH access to your VPS
- ✅ Domain name (optional but recommended)

---

## Deployment Options

### Option A: Web Application Deployment (Recommended for Server)

Convert the app to a pure Next.js web application and deploy to Hostinger VPS.

### Option B: Desktop Application Distribution

Keep as desktop app and use Hostinger for hosting download files.

---

## Option A: Web Application Deployment

### Step 1: Prepare the Application

#### 1.1 Remove Electron Dependencies

```bash
cd GOAT-Royalty-App2

# Remove Electron packages
npm uninstall electron electron-builder

# Update package.json scripts
```

#### 1.2 Update package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p 3000",
    "export": "next export"
  }
}
```

#### 1.3 Create Environment Configuration

```bash
# Create .env.production
cat > .env.production << EOF
# API Keys
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_google_key
SUPERNINJA_API_KEY=fF3mdJBw4IrG8f25sRiCeCWEQpwbArfXGQULv01K52f0b9b4

# Application Settings
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
EOF
```

### Step 2: Set Up Hostinger VPS

#### 2.1 Connect to Your VPS

```bash
# Get VPS IP from Hostinger API
curl -X GET "https://developers.hostinger.com/api/vps/v1/virtual-machines" \
  -H "Authorization: Bearer $HOSTINGER_API_TOKEN" \
  -H "Content-Type: application/json"

# SSH into VPS
ssh root@YOUR_VPS_IP
```

#### 2.2 Install Required Software

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 (Process Manager)
npm install -g pm2

# Install Nginx (Web Server)
apt install -y nginx

# Install Certbot (SSL Certificates)
apt install -y certbot python3-certbot-nginx

# Verify installations
node --version
npm --version
pm2 --version
nginx -v
```

#### 2.3 Set Up Firewall

```bash
# Configure UFW firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

### Step 3: Deploy Application

#### 3.1 Clone Repository to VPS

```bash
# Create application directory
mkdir -p /var/www
cd /var/www

# Clone your repository
git clone https://github.com/DJSPEEDYGA/GOAT-Royalty-App2.git
cd GOAT-Royalty-App2

# Install dependencies
npm install --production
```

#### 3.2 Configure Environment Variables

```bash
# Create production environment file
nano .env.production

# Add your environment variables:
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_google_key
SUPERNINJA_API_KEY=fF3mdJBw4IrG8f25sRiCeCWEQpwbArfXGQULv01K52f0b9b4
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Save and exit (Ctrl+X, Y, Enter)
```

#### 3.3 Build Application

```bash
# Build Next.js application
npm run build

# Test the build
npm start
# Press Ctrl+C to stop
```

#### 3.4 Set Up PM2

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
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

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Follow the command output instructions

# Check status
pm2 status
pm2 logs goat-royalty-app
```

### Step 4: Configure Nginx

#### 4.1 Create Nginx Configuration

```bash
# Create Nginx site configuration
nano /etc/nginx/sites-available/goat-royalty-app

# Add the following configuration:
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL certificates (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Next.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Client max body size
    client_max_body_size 50M;
}
```

#### 4.2 Enable Site and Configure SSL

```bash
# Enable the site
ln -s /etc/nginx/sites-available/goat-royalty-app /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx

# Get SSL certificate (replace with your domain)
certbot --nginx -d your-domain.com -d www.your-domain.com

# Test SSL renewal
certbot renew --dry-run
```

### Step 5: Configure Domain DNS

In your domain registrar (or Hostinger DNS):

```
Type    Name    Value           TTL
A       @       YOUR_VPS_IP     3600
A       www     YOUR_VPS_IP     3600
```

### Step 6: Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs goat-royalty-app --lines 50

# Check Nginx status
systemctl status nginx

# Test application
curl http://localhost:3000
curl https://your-domain.com
```

---

## Option B: Desktop Application Distribution

Use Hostinger VPS to host desktop application installers.

### Step 1: Build Desktop Applications

```bash
# On your local machine
cd GOAT-Royalty-App2

# Build for Windows
npm run electron-builder -- --win

# Build for macOS
npm run electron-builder -- --mac

# Build for Linux
npm run electron-builder -- --linux

# Installers will be in dist/ folder
```

### Step 2: Set Up Download Server

```bash
# On Hostinger VPS
mkdir -p /var/www/downloads
cd /var/www/downloads

# Create directory structure
mkdir -p goat-royalty-app/{windows,mac,linux}
```

### Step 3: Upload Installers

```bash
# From your local machine
scp dist/*.exe root@YOUR_VPS_IP:/var/www/downloads/goat-royalty-app/windows/
scp dist/*.dmg root@YOUR_VPS_IP:/var/www/downloads/goat-royalty-app/mac/
scp dist/*.AppImage root@YOUR_VPS_IP:/var/www/downloads/goat-royalty-app/linux/
```

### Step 4: Create Download Page

```bash
# On VPS
cat > /var/www/downloads/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download GOAT Royalty App</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        .download-section {
            margin: 30px 0;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .download-btn {
            display: inline-block;
            padding: 12px 24px;
            background: #0070f3;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 5px;
        }
        .download-btn:hover {
            background: #0051cc;
        }
    </style>
</head>
<body>
    <h1>Download GOAT Royalty App</h1>
    <p>Choose your platform:</p>
    
    <div class="download-section">
        <h2>🪟 Windows</h2>
        <a href="/goat-royalty-app/windows/GOAT-Royalty-App-Setup.exe" class="download-btn">
            Download for Windows (.exe)
        </a>
    </div>
    
    <div class="download-section">
        <h2>🍎 macOS</h2>
        <a href="/goat-royalty-app/mac/GOAT-Royalty-App.dmg" class="download-btn">
            Download for macOS (.dmg)
        </a>
    </div>
    
    <div class="download-section">
        <h2>🐧 Linux</h2>
        <a href="/goat-royalty-app/linux/GOAT-Royalty-App.AppImage" class="download-btn">
            Download for Linux (.AppImage)
        </a>
    </div>
    
    <div class="download-section">
        <h3>Installation Instructions</h3>
        <ul>
            <li><strong>Windows:</strong> Run the .exe file and follow the installer</li>
            <li><strong>macOS:</strong> Open the .dmg file and drag to Applications</li>
            <li><strong>Linux:</strong> Make the .AppImage executable and run it</li>
        </ul>
    </div>
</body>
</html>
EOF
```

### Step 5: Configure Nginx for Downloads

```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/downloads

# Add configuration:
```

```nginx
server {
    listen 80;
    server_name downloads.your-domain.com;

    root /var/www/downloads;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
        autoindex on;
    }

    location ~* \.(exe|dmg|AppImage|zip)$ {
        add_header Content-Disposition 'attachment';
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/downloads /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## Automation Scripts

### Deployment Script

```bash
# deploy.sh
#!/bin/bash

echo "🚀 Deploying GOAT Royalty App..."

# Pull latest code
cd /var/www/GOAT-Royalty-App2
git pull origin main

# Install dependencies
npm install --production

# Build application
npm run build

# Restart PM2
pm2 restart goat-royalty-app

# Check status
pm2 status

echo "✅ Deployment complete!"
```

### Backup Script

```bash
# backup.sh
#!/bin/bash

BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup application
tar -czf $BACKUP_DIR/goat-app-$DATE.tar.gz /var/www/GOAT-Royalty-App2

# Backup Nginx config
tar -czf $BACKUP_DIR/nginx-config-$DATE.tar.gz /etc/nginx

# Keep only last 7 backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ Backup complete: $BACKUP_DIR"
```

### Monitoring Script

```bash
# monitor.sh
#!/bin/bash

# Check if application is running
if ! pm2 list | grep -q "goat-royalty-app.*online"; then
    echo "❌ Application is down! Restarting..."
    pm2 restart goat-royalty-app
    
    # Send alert (configure with your email)
    echo "GOAT Royalty App was down and has been restarted" | \
        mail -s "Alert: Application Restart" your-email@example.com
fi

# Check disk space
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "⚠️  Disk usage is at ${DISK_USAGE}%"
fi

# Check memory usage
MEM_USAGE=$(free | grep Mem | awk '{print ($3/$2) * 100.0}' | cut -d. -f1)
if [ $MEM_USAGE -gt 80 ]; then
    echo "⚠️  Memory usage is at ${MEM_USAGE}%"
fi
```

### Set Up Cron Jobs

```bash
# Edit crontab
crontab -e

# Add these lines:
# Deploy updates daily at 2 AM
0 2 * * * /root/deploy.sh >> /var/log/deploy.log 2>&1

# Backup daily at 3 AM
0 3 * * * /root/backup.sh >> /var/log/backup.log 2>&1

# Monitor every 5 minutes
*/5 * * * * /root/monitor.sh >> /var/log/monitor.log 2>&1
```

---

## Maintenance Commands

```bash
# View application logs
pm2 logs goat-royalty-app

# Restart application
pm2 restart goat-royalty-app

# Stop application
pm2 stop goat-royalty-app

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Check system resources
htop
df -h
free -h

# Update application
cd /var/www/GOAT-Royalty-App2
git pull
npm install
npm run build
pm2 restart goat-royalty-app
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs goat-royalty-app --lines 100

# Check if port is in use
netstat -tulpn | grep 3000

# Restart PM2
pm2 restart goat-royalty-app
```

### SSL Certificate Issues

```bash
# Renew certificate manually
certbot renew

# Check certificate status
certbot certificates

# Test SSL configuration
nginx -t
```

### High Memory Usage

```bash
# Check memory usage
pm2 monit

# Restart application
pm2 restart goat-royalty-app

# Clear PM2 logs
pm2 flush
```

---

## Security Checklist

- [ ] Firewall configured (UFW)
- [ ] SSH key authentication enabled
- [ ] Root login disabled
- [ ] SSL certificate installed
- [ ] Environment variables secured
- [ ] Regular backups scheduled
- [ ] Monitoring set up
- [ ] Fail2ban installed (optional)
- [ ] Regular updates scheduled

---

## Next Steps

1. Choose deployment option (Web App or Desktop Distribution)
2. Follow the appropriate guide above
3. Test thoroughly
4. Set up monitoring and backups
5. Configure domain and SSL
6. Deploy to production

For questions or issues, refer to the troubleshooting section or check the logs.