# 🚀 GOAT Royalty App - Express Server Guide

## 📋 OVERVIEW

This guide explains how to use the Express server as a fallback solution when Next.js builds fail due to memory issues. The Express server can serve static content and API endpoints while we work on resolving the build issues.

## 🎯 SERVER FEATURES

### 1. Static File Serving
- Serves files from the `public` directory
- Handles CSS, JavaScript, images, and HTML files

### 2. API Endpoints
- `/api/health` - Health check endpoint
- `/` - Main page
- `*` - All other routes (fallback to index.html)

### 3. Port Configuration
- Default port: 3000
- Can be overridden with `PORT` environment variable

## ▶️ STARTING THE SERVER

### Method 1: Direct Command
```bash
cd GOAT-Royalty-App2
node server.js
```

### Method 2: Using npm script
Add this to your `package.json` scripts section:
```json
"scripts": {
  "express": "node server.js"
}
```

Then run:
```bash
npm run express
```

## 🌐 ACCESSING THE APPLICATION

Once the server is running, open your browser to:
```
http://localhost:3000
```

You should see the GOAT Royalty Force application interface.

## 🔧 SERVER CONFIGURATION

### Changing the Port
```bash
PORT=8080 node server.js
```

Or set it as an environment variable:
```bash
export PORT=8080
node server.js
```

### Checking Server Status
Visit the health endpoint:
```
http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "GOAT Royalty App API is running",
  "timestamp": "2025-10-26T12:46:36.000Z"
}
```

## 📁 DIRECTORY STRUCTURE

```
GOAT-Royalty-App2/
├── server.js          # Express server implementation
├── public/            # Static files directory
│   ├── index.html     # Main application page
│   ├── favicon.ico    # Application icon
│   ├── logo192.png    # App logo
│   ├── logo512.png    # App logo
│   ├── manifest.json  # Web app manifest
│   └── robots.txt     # Robots file
├── pages/
│   └── api/
│       └── health.js  # Health check API endpoint
└── components/        # React components (not served by Express)
```

## 🛠️ TROUBLESHOOTING

### Problem: "Port already in use"
```bash
# Kill process using port 3000
npx kill-port 3000

# Or use a different port
PORT=8080 node server.js
```

### Problem: "Cannot find module 'express'"
```bash
npm install express@4.18.2
```

### Problem: "EACCES permission denied"
```bash
# Use a port above 1024
PORT=8080 node server.js
```

## 🚀 DEPLOYMENT WITH EXPRESS

### Local Development
```bash
cd GOAT-Royalty-App2
node server.js
```

### Production Deployment
For production deployment, consider using PM2:
```bash
# Install PM2 globally
npm install -g pm2

# Start server with PM2
pm2 start server.js --name "goat-royalty-app"

# Save process list
pm2 save

# Set up startup script
pm2 startup
```

### Using with Process Managers
```bash
# Forever
npm install -g forever
forever start server.js

# Nodemon (for development)
npm install -g nodemon
nodemon server.js
```

## 🔒 SECURITY CONSIDERATIONS

### 1. Production Hardening
- Use a reverse proxy (Nginx) in production
- Implement proper error handling
- Add rate limiting for API endpoints
- Use HTTPS in production

### 2. Environment Variables
Store sensitive configuration in environment variables:
```bash
# Create a .env file
echo "PORT=8080" > .env
```

### 3. Static File Security
- Validate file paths to prevent directory traversal
- Set proper cache headers
- Implement content security policy

## 📊 MONITORING

### PM2 Monitoring
```bash
# View running processes
pm2 list

# View logs
pm2 logs goat-royalty-app

# Monitor resources
pm2 monit
```

### Health Check
Regularly check the health endpoint:
```bash
curl http://localhost:3000/api/health
```

## 🔄 UPDATING THE SERVER

### Pull Latest Changes
```bash
git pull origin feature/advanced-camera-sora2-integration
```

### Restart Server
```bash
# If using PM2
pm2 restart goat-royalty-app

# If running directly
# Press Ctrl+C to stop
# Run node server.js to start
```

## 🎯 WHEN TO USE THIS SERVER

### Use Express Server When:
- Next.js build fails due to memory issues
- You need a quick way to serve static files
- You want to test API endpoints without full React build
- You're deploying to a resource-constrained environment

### Switch Back to Next.js When:
- Memory issues are resolved
- You need full React functionality
- You want to use Next.js features (SSR, SSG, API routes)

## 📞 SUPPORT

If you encounter issues with the Express server:

1. Check that all dependencies are installed:
   ```bash
   npm install express@4.18.2
   ```

2. Verify the server starts without errors:
   ```bash
   node server.js
   ```

3. Test the health endpoint:
   ```bash
   curl http://localhost:3000/api/health
   ```

4. Check that static files are being served:
   ```bash
   curl http://localhost:3000/
   ```

---

**Made with 💜 by SuperNinja AI for DJ Speedy**
**GOAT Royalty Force - Truth, Justice, and Pay Us Our Money! 💰**