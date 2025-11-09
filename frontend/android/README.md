# Lucksy Android App

## Quick Info
- **App Name**: Lucksy
- **Package ID**: app.lucksy.lovable
- **Platform**: Android (Capacitor 7.4.4)
- **Features**: AdMob Integration, Backend API Connection

## Building the APK

### Prerequisites
- Java JDK 17
- Android SDK (API 34)
- Node.js & Yarn

### Quick Build
```bash
# From project root
./build-apk.sh
```

### Manual Build
```bash
cd frontend
yarn install
yarn build
npx cap sync android
cd android
./gradlew assembleDebug
```

### Output Location
```
frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

## Installation on Device

### Via ADB
```bash
adb install app-debug.apk
```

### Via File Transfer
1. Copy APK to device
2. Open file manager
3. Tap APK file
4. Allow installation from unknown sources if prompted
5. Install

## Configuration

### Backend URL
Configured in `frontend/capacitor.config.ts`:
```typescript
server: {
  url: 'https://d7d9a4b7-24fa-42ec-93a3-18df0dd5f545.lovableproject.com?forceHideBadge=true',
  cleartext: true
}
```

### AdMob
App ID: `ca-app-pub-3486145054830108~3206188816`

## Gradle Tasks

### Debug Build
```bash
./gradlew assembleDebug
```

### Release Build
```bash
./gradlew assembleRelease
```

### Clean Build
```bash
./gradlew clean
```

### Generate AAB (for Play Store)
```bash
./gradlew bundleRelease
```

## Project Structure
```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── assets/          # Web assets synced here
│   │       ├── AndroidManifest.xml
│   │       └── res/             # Android resources
│   └── build.gradle
├── capacitor-cordova-android-plugins/
├── build.gradle
├── gradle.properties
├── gradlew                      # Gradle wrapper script
└── settings.gradle
```

## Troubleshooting

### Gradle Daemon Issues
```bash
./gradlew --stop
./gradlew clean
./gradlew assembleDebug
```

### Clear Cache
```bash
rm -rf .gradle
rm -rf app/build
./gradlew clean
```

### Update Dependencies
```bash
./gradlew --refresh-dependencies
```

## Signing for Release

1. Generate keystore:
```bash
keytool -genkey -v -keystore lucksy-release.keystore -alias lucksy -keyalg RSA -keysize 2048 -validity 10000
```

2. Add to `gradle.properties`:
```properties
LUCKSY_UPLOAD_STORE_FILE=../lucksy-release.keystore
LUCKSY_UPLOAD_KEY_ALIAS=lucksy
LUCKSY_UPLOAD_STORE_PASSWORD=***
LUCKSY_UPLOAD_KEY_PASSWORD=***
```

3. Build release:
```bash
./gradlew assembleRelease
```

## Support
- Capacitor Docs: https://capacitorjs.com/docs/android
- Android Developer: https://developer.android.com
