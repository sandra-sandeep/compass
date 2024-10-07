#!/bin/bash

sudo su

# Update Glass
git pull
cd glass
npm ci
npm run build
pm2 restart glass

# Update Metal
cd ../metal
uv sync
sudo systemctl restart metal.service

echo "Both Glass and Metal have been updated and restarted."