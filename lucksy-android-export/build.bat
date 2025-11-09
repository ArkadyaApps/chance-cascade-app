@echo off
echo Building Lucksy APK...
cd android
gradlew.bat assembleDebug
echo Done! APK: android\app\build\outputs\apk\debug\app-debug.apk
pause
