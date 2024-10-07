#!/bin/bash

# Enable command echoing
set -x

# Update Glass
cd glass
git pull || { echo "Git pull failed for Glass"; exit 1; }
npm ci || { echo "npm ci failed for Glass"; exit 1; }
npm run build || { echo "Build failed for Glass"; exit 1; }
pm2 restart glass || { echo "PM2 restart failed for Glass"; exit 1; }

# Update Metal
cd ../metal
git pull || { echo "Git pull failed for Metal"; exit 1; }
uv sync || { echo "uv sync failed for Metal"; exit 1; }
sudo systemctl restart metal.service || { echo "Systemctl restart failed for Metal"; exit 1; }

echo "Both Glass and Metal have been updated and restarted."

# Disable command echoing if needed
# set +x