#!/bin/bash

# Lucksy APK Build Script
# This script automates the APK building process on x86_64 systems

set -e

echo "🎯 Building Lucksy APK..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: frontend directory not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

cd frontend

echo -e "${BLUE}Step 1/5:${NC} Installing dependencies..."
yarn install

echo -e "${BLUE}Step 2/5:${NC} Building React app..."
yarn build

echo -e "${BLUE}Step 3/5:${NC} Syncing with Capacitor..."
npx cap sync android

echo -e "${BLUE}Step 4/5:${NC} Making gradlew executable..."
chmod +x android/gradlew

echo -e "${BLUE}Step 5/5:${NC} Building APK..."
cd android
./gradlew assembleDebug

# Check if APK was created
APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}✅ APK built successfully!${NC}"
    echo ""
    echo "📱 App Name: Lucksy"
    echo "📦 Package: app.lucksy.lovable"
    echo "📂 Location: frontend/android/$APK_PATH"
    echo ""
    FILE_SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')
    echo "💾 Size: $FILE_SIZE"
    echo ""
    echo "🎉 You can now install this APK on your Android device!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo "❌ Error: APK not found at expected location"
    exit 1
fi
