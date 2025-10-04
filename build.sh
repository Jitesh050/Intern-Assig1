#!/bin/bash

# Build script for deployment

echo "Building frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

echo "Building backend..."
cd backend
npm install --production
cd ..

echo "Build complete!"
