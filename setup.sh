#!/bin/bash

# Update and upgrade the system
sudo apt update && sudo apt upgrade -y

# Install Git
sudo apt install git -y

# Install Node.js and npm (for glass)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python 3.10 and pip (for metal)
sudo apt install -y python3.10 python3.10-venv python3.10-dev
sudo apt install -y python3-pip

# Install uv (Python package installer and virtual environment manager)
pip install uv

# Clone the repositories
git clone git@github.com:sandra-sandeep/compass.git

# Setup glass (Next.js frontend)
cd compass/glass
npm install

# Build the Next.js application
npm run build

# Setup metal (Flask backend)
cd ../metal
uv sync

# Print completion message
echo "Setup complete. Glass and Metal are ready to be served."

# Install PM2 (Process Manager for Node.js)
sudo npm install -g pm2

# Start the Next.js application with PM2
pm2 start npm --name "glass" -- start

# Save the PM2 process list and configure it to start on boot
pm2 save
pm2 startup

# Setup a systemd service for the Flask application (Metal)
sudo tee /etc/systemd/system/metal.service > /dev/null <<EOL
[Unit]
Description=Metal Flask Application
After=network.target

[Service]
User=$USER
WorkingDirectory=$HOME/compass/metal
Environment="PATH=$HOME/compass/metal/.venv/bin"
ExecStart=$HOME/compass/metal/.venv/bin/flask run --host=0.0.0.0 --port=5000

[Install]
WantedBy=multi-user.target
EOL

# Reload systemd to apply the new service
sudo systemctl daemon-reload

# Enable and start the Metal service
sudo systemctl enable metal.service
sudo systemctl start metal.service

# Print completion message
echo "Process managers for Glass and Metal have been set up and started."

