#!/bin/bash

# Package Lucksy Project for External Building
# This creates a clean export of the Android project

set -e

echo "📦 Packaging Lucksy for APK building..."

# Create export directory
EXPORT_DIR="lucksy-android-export"
rm -rf "$EXPORT_DIR"
mkdir -p "$EXPORT_DIR"

echo "Copying Android project..."
cp -r frontend/android "$EXPORT_DIR/"

echo "Copying built web assets..."
cp -r frontend/build "$EXPORT_DIR/web-build"

echo "Copying configuration..."
cp frontend/capacitor.config.ts "$EXPORT_DIR/"
cp frontend/package.json "$EXPORT_DIR/"

echo "Creating README..."
cat > "$EXPORT_DIR/README.txt" << 'EOF'
LUCKSY ANDROID PROJECT - BUILD PACKAGE

This package contains everything needed to build the Lucksy Android APK.

REQUIREMENTS:
- Java JDK 17
- Android Studio (or Android SDK command-line tools)
- An x86_64 computer (Windows, Mac, or Linux)

QUICK BUILD:
1. Open Android Studio
2. Open the "android" folder as a project
3. Wait for Gradle sync to complete
4. Click Build → Build Bundle(s) / APK(s) → Build APK(s)
5. Find your APK in: android/app/build/outputs/apk/debug/

COMMAND LINE BUILD:
1. cd android
2. ./gradlew assembleDebug
3. APK will be at: app/build/outputs/apk/debug/app-debug.apk

APP INFO:
- Name: Lucksy
- Package: app.lucksy.lovable
- Backend: https://d7d9a4b7-24fa-42ec-93a3-18df0dd5f545.lovableproject.com

TROUBLESHOOTING:
- If build fails, try: ./gradlew clean assembleDebug
- Make sure ANDROID_HOME is set
- Ensure you have Android SDK API 34 installed

For full documentation, see BUILD_APK_GUIDE.md in the main project.
EOF

echo "Creating build script..."
cat > "$EXPORT_DIR/build.sh" << 'EOF'
#!/bin/bash
set -e
echo "Building Lucksy APK..."
cd android
chmod +x gradlew
./gradlew assembleDebug
echo "✅ Done! APK: android/app/build/outputs/apk/debug/app-debug.apk"
EOF
chmod +x "$EXPORT_DIR/build.sh"

cat > "$EXPORT_DIR/build.bat" << 'EOF'
@echo off
echo Building Lucksy APK...
cd android
gradlew.bat assembleDebug
echo Done! APK: android\app\build\outputs\apk\debug\app-debug.apk
pause
EOF

# Create archive
echo "Creating archive..."
tar -czf lucksy-android-export.tar.gz "$EXPORT_DIR"
zip -rq lucksy-android-export.zip "$EXPORT_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Package created successfully!"
echo ""
echo "📦 Archives created:"
echo "   - lucksy-android-export.tar.gz (for Linux/Mac)"
echo "   - lucksy-android-export.zip (for Windows)"
echo ""
echo "📂 Folder: $EXPORT_DIR/"
echo ""
echo "🚀 Transfer this to an x86_64 machine and run:"
echo "   Linux/Mac: cd $EXPORT_DIR && ./build.sh"
echo "   Windows: cd $EXPORT_DIR && build.bat"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
