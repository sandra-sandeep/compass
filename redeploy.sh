#!/bin/bash

# Enable command echoing
set -x

# Pull the most recent changes
git pull || { echo "Git pull failed"; exit 1; }

# Update Glass
pm2 stop glass || { echo "PM2 stop failed for Glass"; exit 1; }
cd glass
npm run build || { echo "Build failed for Glass"; exit 1; }
pm2 restart glass || { echo "PM2 restart failed for Glass"; exit 1; }

# Update Metal
cd ../metal
sudo systemctl stop metal.service || { echo "Systemctl stop failed for Metal"; exit 1; }
uv sync || { echo "uv sync failed for Metal"; exit 1; }
sudo systemctl restart metal.service || { echo "Systemctl restart failed for Metal"; exit 1; }

echo "Both Glass and Metal have been updated and restarted."

# Disable command echoing if needed
# set +x