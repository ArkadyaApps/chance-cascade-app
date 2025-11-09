#!/bin/bash
set -e
echo "Building Lucksy APK..."
cd android
chmod +x gradlew
./gradlew assembleDebug
echo "✅ Done! APK: android/app/build/outputs/apk/debug/app-debug.apk"
