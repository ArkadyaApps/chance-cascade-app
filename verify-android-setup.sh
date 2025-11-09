#!/bin/bash

# Lucksy Android Setup Verification Script
# Checks if all necessary files and configurations are in place

echo "🔍 Verifying Lucksy Android Setup..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        ((ERRORS++))
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        ((ERRORS++))
        return 1
    fi
}

check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $3"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $3"
        ((WARNINGS++))
        return 1
    fi
}

echo ""
echo "📁 Checking Project Structure..."
check_dir "frontend" "Frontend directory exists"
check_dir "frontend/android" "Android project directory exists"
check_dir "frontend/build" "Built web assets exist"
check_dir "frontend/src" "React source code exists"

echo ""
echo "📄 Checking Configuration Files..."
check_file "frontend/capacitor.config.ts" "Capacitor config exists"
check_file "frontend/package.json" "Package.json exists"
check_file "frontend/vite.config.ts" "Vite config exists"
check_file ".emergent/emergent.yml" "Emergent config exists"

echo ""
echo "🤖 Checking Android Project Files..."
check_file "frontend/android/gradlew" "Gradle wrapper exists"
check_file "frontend/android/build.gradle" "Root build.gradle exists"
check_file "frontend/android/app/build.gradle" "App build.gradle exists"
check_file "frontend/android/app/src/main/AndroidManifest.xml" "AndroidManifest.xml exists"

echo ""
echo "⚙️  Checking Configuration Values..."
check_content "frontend/capacitor.config.ts" "app.lucksy.lovable" "Package ID set to app.lucksy.lovable"
check_content "frontend/capacitor.config.ts" "Lucksy" "App name set to Lucksy"
check_content "frontend/capacitor.config.ts" "webDir: 'build'" "Web directory set to 'build'"
check_content "frontend/vite.config.ts" "outDir: 'build'" "Vite output directory is 'build'"
check_content ".emergent/emergent.yml" "lovable" "Source set to lovable"

echo ""
echo "📚 Checking Documentation..."
check_file "BUILD_APK_GUIDE.md" "Build guide exists"
check_file "QUICKSTART_APK.md" "Quick start guide exists"
check_file "ANDROID_PROJECT_STATUS.md" "Status report exists"
check_file "frontend/android/README.md" "Android README exists"

echo ""
echo "🛠️  Checking Build Scripts..."
check_file "build-apk.sh" "Build script exists"
check_file "package-for-build.sh" "Package script exists"
check_file ".github/workflows/build-apk.yml" "GitHub Actions workflow exists"

if [ -x "build-apk.sh" ]; then
    echo -e "${GREEN}✓${NC} build-apk.sh is executable"
else
    echo -e "${YELLOW}⚠${NC} build-apk.sh is not executable (run: chmod +x build-apk.sh)"
    ((WARNINGS++))
fi

if [ -x "frontend/android/gradlew" ]; then
    echo -e "${GREEN}✓${NC} gradlew is executable"
else
    echo -e "${YELLOW}⚠${NC} gradlew is not executable (run: chmod +x frontend/android/gradlew)"
    ((WARNINGS++))
fi

echo ""
echo "🔍 Checking Web Assets..."
if [ -f "frontend/build/index.html" ]; then
    echo -e "${GREEN}✓${NC} Built web app exists (index.html found)"
else
    echo -e "${YELLOW}⚠${NC} Built web app not found (run: cd frontend && yarn build)"
    ((WARNINGS++))
fi

if [ -d "frontend/android/app/src/main/assets/public" ]; then
    if [ "$(ls -A frontend/android/app/src/main/assets/public)" ]; then
        echo -e "${GREEN}✓${NC} Web assets synced to Android project"
    else
        echo -e "${YELLOW}⚠${NC} Assets directory empty (run: npx cap sync android)"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}✗${NC} Assets directory doesn't exist"
    ((ERRORS++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 Perfect!${NC} Everything is configured correctly!"
    echo ""
    echo "Your Lucksy Android project is ready to build!"
    echo ""
    echo "Next steps:"
    echo "  1. Read QUICKSTART_APK.md for build options"
    echo "  2. Choose your preferred build method"
    echo "  3. Build and test your APK"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Almost there!${NC} Configuration is complete with $WARNINGS warning(s)"
    echo ""
    echo "Your project will build successfully, but consider:"
    echo "  - Running any suggested commands above"
    echo "  - Checking QUICKSTART_APK.md for build options"
else
    echo -e "${RED}❌ Issues found:${NC} $ERRORS error(s), $WARNINGS warning(s)"
    echo ""
    echo "Please fix the errors above before building."
    echo "Check ANDROID_PROJECT_STATUS.md for setup details"
    exit 1
fi

echo ""
echo "📱 App Information:"
echo "   Name: Lucksy"
echo "   Package: app.lucksy.lovable"
echo "   Platform: Android (Capacitor 7.4.4)"
echo "   Backend: Connected"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
