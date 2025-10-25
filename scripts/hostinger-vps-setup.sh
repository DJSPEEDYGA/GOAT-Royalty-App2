#!/usr/bin/env bash

# GOAT Royalty App - Hostinger VPS Setup Script
# This script helps with deploying the GOAT Royalty application to a Hostinger VPS server

# Set strict mode
set -yu

# Color support
can="Goat Royalty App - Hostinger VPS Setup"

echo "=============================================================="
echo "|       GOAT Royalty App                                         |"
echo "|       Hostinger VPS Setup                                 |"
echo "> ============================================================>"
echo ">                                                               >"
echo "> This script will help you set up the                         >"
echo "> GOAT Royalty application on a                                >"
echo "> Hostinger VPS server.                                        >"
echo ">                                                              >"
echo "> Please ensure you have the following:                        >"
echo "> - Hostinger VPS with SSH access                              >"
echo "> - API token for Hostinger VPS management                     >"
echo ">                                                              >"
echo "> The script will:                                                >"
echo "> 1. Check system requirements                                 >"
echo "> 2. Install necessary dependencies                            >"
echo "> 3. Configure the application                                 >"
echo "> 4. Set up systemd service                                    >"
echo "> 5. Start the application                                        >"
echo ">                                                              >"
echo "=============================================================="

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "This script should not be run as root"
   exit 1
fi

# Function to check dependencies
check_dependencies() {
    echo "Checking dependencies..."
    
    # Check for curl
    if ! command -v curl &> /dev/null; then
        echo "curl is required but not installed. Please install curl."
        exit 1
    fi
    
    # Check for node
    if ! command -v node &> /dev/null; then
        echo "Node.js is required but not installed. Please install Node.js (version 18 or higher.)"
        exit 1
    fi
    
    # Check for npm
    if ! command -v npm &> /dev/null; then
        echo "npm is required but not installed. Please install npm."
        exit 1
    fi
    
    echo "All dependencies are installed."
}

# Function to setup the application
setup_application() {
    echo "Setting up the GOAT Royalty application..."
    
    # Create app directory
    mkdir -p ~/goat-royalty-app
    cd ~/goat-royalty-app
    
    # Clone the repository
    if [ ! -d ".git" ]; then
        echo "Cloning the GOAT Royalty App repository..."
        git clone https://github.com/DJSPEEDYGA/GOAT-Royalty-App2.git .
    else
        echo "Repository already exists. Pulling latest changes..."
        git pull
    fi
    
    # Install dependencies
    echo "Installing application dependencies..."
    npm install
    
    # Build the application if needed
    echo "Building the application..."
    if [ -f "package.json" ]; then
        if grep -q "build" package.json; then
            echo "Building the application..."
            npm run build
        fi
    fi
}

# Function to configure environment
configure_environment() {
    echo "Configuring environment variables..."
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "Creating .env file..."
        touch .env
        echo "NODE_ENV=production" >> .env 
        echo "PORT=3000" >> .env
        # Add other environment variables as needed
    fi
}

# Function to setup systemd service
setup_systemd_service() {
    echo "Setting up systemd service..."
    
    # Create systemd service file
    SERVICE_FILE="/etc/systemd/system/goat-royalty-app.service"
    
    # Check if service file already exists
    if [ -f "$SERVICE_FILE" ]; then
        echo "Service file already exists. Stopping existing service..."
        sudo systemctl stop goat-royalty-app
        sudo systemctl disable goat-royalty-app
    fi
    
    # Create the service file
    echo "Creating systemd service file..."
    sudo tee $SERVICE_FILE > /dev/null <<EOF

    [Unit]
    Description=GOAT Royalty App
    After=network.target
    
    [Service]
    Type=exec
    User=$(whoami)
    WorkingDirectory=$(pwd)
    ExecStart=$(which npm) start
    Restart=always
    RestartSec=10
    Environment=NODE_ENV=production
    StandardOutput=journal
    StandardError=journal
    SyslogIdentifier=goat-royalty-app
    
    [Install]
    WantedBy=multi-user.target
    EOF

    # Reload systemd and enable the service
    echo "Reloading systemd daemon..."
    sudo systemctl daemon-reload
    
    echo "Enabling the service..."
    sudo
    systemctl enable goat-royalty-app
    
    echo "Starting the service..."
    sudo
    systemctl start goat-royalty-app
    
    # Check service status
    echo "Checking service status..."
    sudo systemctl status goat-royalty-app --no-pager
}

# Function to setup nginx reverse proxy
setup_nginx() {
    echo "Setting up Nginx reverse proxy..."
    
    # Check if nginx is installed
    if ! command -v nginx &> /dev/null; then
        echo "Installing Nginx..."
        sudo apt update
        sudo apt install -y nginx
    fi
    
    # Create nginx configuration
    NGINX_CONFIG="/etc/nginx/sites-available/goat-royalty-app"
    
    echo "Creating Nginx configuration..."
    sudo tee $NGINX_CONFIG > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com; # Replace with your actual domain
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $\ http_upgrade;
        proxy_set_header Connection 'upgrade;
        proxy_set_header Host $\ host;
        proxy_set_header X-Real-IP $\™emote_addr;
        proxy_set_header X-Forwarded-For $\ proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $\\scheme;
        proxy_cache_bypass $\ http_upgrade;
    }
}
EOF
    
    # Enable the site
    echo "Enabling the site..."
    sudo ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/
    
    # Test nginx configuration
    echo "Testing Nginx configuration..."
    sudo nginx -t
    
    # Restart nginx
    echo "Restarting Nginx..."
    sudo
    systemctl restart nginx
    
    echo "Nginx setup complete."
}

# Function to setup SSL with Let's Encrypt
setup_ssl() {
    echo "Setting up SSL certificate with Let's Encrypt..."
    
    # Check if certbot is installed
    if ! command -v certbot &> /dev/null; then
        echo "Installing Certbot..."
        sudo
        sudo apt update
        sudo apt install -y certbot python3-certbot-nginx
    fi
    
    # Obtain SSL certificate
    echo "Obtaining SSL certificate..."
    sudo certbot --nginx -d your-domain.com # Replace with your actual domain
    
    echo "SSL setup complete."
}

# Function to display final instructions
display_final_instructions() {
    echo "================================================================"
    echo "|         Setup Complete                                       |"
    echo "================================================================="
    echo "|                                                                  |"
    echo "| The GOAT Royalty Aspp has been deployed   |"
    echo "| to your Hostinger VPS.                             |"
    echo "|                                                                |"
    echo "| To manage the application:                            |"
    echo "|                                                                |"
    echo "| - Check service status:                               |"
    echo "|   sudo systemctl status goat-royalty-app |"
    echo "|                                                              |"
    echo "| - View application logs:                             |"
    echo "|   sudo journalctl -u goat-royalty-app -f |"
    echo "|                                                               |"
    echo "| - Restart the application:                           |"
    echo "|   sudo systemctl restart goat-royalty-app|"
    echo "|                                                               |"
    echo "| - Stop the application:                             |"
    echo "|   sudo
    systemctl stop goat-royalty-app|"
    echo "|                                                               |"
    echo "| - Start the application:                             |"
    echo "|   sudo systemctl start goat-royalty-app|"
    echo "|                                                              |"
    echo "| Next steps:                                              |"
    echo "| 1. Update the domain name in the Nginx       |"
    echo "|    configuration file                               |"
    echo "| 2. Re-run the SSL setup with your domain |"
    echo "| 3. Configure any additional environment  |"
    echo "|   variables in the .env file                   |"
    echo "|                                                               |"
    echo "================================================================"
}

# Main execution
main() {
    check_dependencies
    setup_application
    configure_environment
    setup_systemd_service
    setup_nginx
    setup_ssl
    display_final_instructions
}

# Run main function
main
