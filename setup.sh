#!/bin/bash

# Before running this script, follow these steps:
#   1. Transfer the .env file to the server and set the correct permissions
#   2. Run these lines and reboot:
# sudo apt-get update && sudo DEBIAN_FRONTEND=noninteractiveNEEDRESTART_MODE=a apt-get dist-upgrade --yes
# sudo reboot
#   3. Download, set permissions, and execute the setup script:
# wget https://raw.githubusercontent.com/sandra-sandeep/compass/refs/heads/main/setup.sh -O setup.sh && chmod +x setup.sh && ./setup.sh

# Check that the .env file exists and has the correct permissions
if [ ! -f ".env" ]; then
    echo "Error: .env file not found. Please transfer the .env file to the server and set the correct permissions."
    exit 1
fi

# Enable command echoing
set -x

# Set DEBIAN_FRONTEND to noninteractive to suppress prompts
export DEBIAN_FRONTEND=noninteractive

# Update and upgrade the system
sudo apt-get update
sudo NEEDRESTART_MODE=a apt-get dist-upgrade --yes || { echo "System upgrade failed"; exit 1; }

# Install Certbot
sudo apt install certbot -y || { echo "Certbot installation failed"; exit 1; }

# Generate SSL certificate
sudo certbot certonly --standalone -d compassletters.com

# Install NGINX
sudo apt install nginx -y || { echo "NGINX installation failed"; exit 1; }

# Generate NGINX configuration
sudo tee /etc/nginx/sites-available/compassletters.com > /dev/null <<EOL
server {
    listen 80;
    server_name compassletters.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name compassletters.com;

    ssl_certificate /etc/letsencrypt/live/compassletters.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/compassletters.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass https://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOL

# Enable the NGINX configuration
sudo ln -s /etc/nginx/sites-available/compassletters.com /etc/nginx/sites-enabled/

# Test NGINX configuration
sudo nginx -t || { echo "NGINX configuration test failed"; exit 1; }

# Restart NGINX
sudo systemctl restart nginx

# Install Git
sudo apt-get install git -y || { echo "Git installation failed"; exit 1; }

# Install Node.js and npm (for glass)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - || { echo "Node.js setup failed"; exit 1; }
sudo apt-get install -y nodejs || { echo "Node.js installation failed"; exit 1; }

# Install Python 3.10 and pip (for metal)
sudo apt-get install -y python3.10 python3.10-venv python3.10-dev || { echo "Python installation failed"; exit 1; }
sudo apt-get install -y python3-pip || { echo "pip installation failed"; exit 1; }

# Install uv (Python package installer and virtual environment manager)
sudo pip install uv || { echo "uv installation failed"; exit 1; }

# Add Github's SSH key to known_hosts to avoid interactive prompt
ssh-keyscan -H github.com >> ~/.ssh/known_hosts

# Clone the repositories with disabled host key checking
git clone https://github.com/sandra-sandeep/compass.git || { echo "Repository clone failed"; exit 1; }

# Setup glass (Next.js frontend)
cd compass/glass
npm ci || { echo "npm ci failed"; exit 1; }

# Build the Next.js application
npm run build || { echo "Next.js build failed"; exit 1; }

# Install PM2 (Process Manager for Node.js)
sudo npm install -g pm2 || { echo "PM2 installation failed"; exit 1; }

# Start the Next.js application with PM2
pm2 start npm --name "glass" -- start || { echo "PM2 start failed"; exit 1; }

# Save the PM2 process list and configure it to start on boot
pm2 save || { echo "PM2 save failed"; exit 1; }
sudo pm2 startup || { echo "PM2 startup failed"; exit 1; }

# Setup metal (Flask backend)
cd ../metal
uv sync || { echo "uv sync failed"; exit 1; }
mv ../../.env .

# Setup a systemd service for the Flask application (Metal)
sudo tee /etc/systemd/system/metal.service > /dev/null <<EOL
[Unit]
Description=Metal Flask Application
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/compass/metal
Environment="FLASK_ENV=production"
ExecStart=uv run metal/app.py --host=0.0.0.0 --port=5000

[Install]
WantedBy=multi-user.target
EOL

# Reload systemd to apply the new service
sudo systemctl daemon-reload || { echo "systemd reload failed"; exit 1; }

# Enable and start the Metal service
sudo systemctl enable metal.service || { echo "systemd enable failed"; exit 1; }
sudo systemctl start metal.service || { echo "systemd start failed"; exit 1; }

# Print completion message
echo "Process managers for Glass and Metal have been set up and started."

# Disable command echoing if needed
# set +x

