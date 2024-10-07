#!/bin/bash

# Before running this script, securely transfer the .env file to the server and set the correct permissions
# Command to download, set permissions, and execute the setup script:
# wget https://raw.githubusercontent.com/sandra-sandeep/compass/refs/heads/main/setup.sh -O setup.sh && chmod +x setup.sh && sudo ./setup.sh

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
sudo NEEDRESTART_MODE=a apt-get dist-upgrade --yes

# Install Git
sudo apt-get install git -y

# Install Node.js and npm (for glass)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python 3.10 and pip (for metal)
sudo apt-get install -y python3.10 python3.10-venv python3.10-dev
sudo apt-get install -y python3-pip

# Install uv (Python package installer and virtual environment manager)
pip install uv

# Add Github's SSH key to known_hosts to avoid interactive prompt
ssh-keyscan -H github.com >> ~/.ssh/known_hosts

# Clone the repositories with disabled host key checking
git clone https://github.com/sandra-sandeep/compass.git

# Check if the clone was successful
if [ $? -ne 0 ]; then
    echo "Error: Failed to clone the repository. Please check your SSH key and try again."
    exit 1
fi

# Setup glass (Next.js frontend)
cd compass/glass
npm ci

# Build the Next.js application
npm run build

# Check if the build was successful
if [ $? -ne 0 ]; then
    echo "Error: Failed to build the glass frontend. Please check your environment and try again."
    exit 1
fi

# Install PM2 (Process Manager for Node.js)
sudo npm install -g pm2

# Start the Next.js application with PM2
pm2 start npm --name "glass" -- start

# Check if the PM2 start command was successful
if [ $? -ne 0 ]; then
    echo "Error: Failed to start the Next.js application with PM2. Please check your environment and try again."
    exit 1
fi

# Save the PM2 process list and configure it to start on boot
pm2 save
pm2 startup

# Setup metal (Flask backend)
cd ../metal
uv sync
mv ../../.env .

# Setup a systemd service for the Flask application (Metal)
sudo tee /etc/systemd/system/metal.service > /dev/null <<EOL
[Unit]
Description=Metal Flask Application
After=network.target

[Service]
User=$USER
WorkingDirectory=$HOME/compass/metal
Environment="FLASK_ENV=production"
ExecStart=uv run metal/app.py --host=0.0.0.0 --port=5000

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


# Disable command echoing if needed
# set +x

