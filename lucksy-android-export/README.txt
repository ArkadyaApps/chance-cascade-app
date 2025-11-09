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
