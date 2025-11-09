# Lucksy APK Build Guide

## Current Status
✅ **Project Configured Successfully:**
- App Name: **Lucksy**
- Package ID: `app.lucksy.lovable`
- Capacitor Android platform added
- Frontend built and synced
- AdMob integration configured
- Backend connection configured

## Architecture Limitation
The current build environment is **ARM64 (aarch64)**, but Android build tools (AAPT2, D8) are compiled for **x86_64** architecture. This prevents direct APK building in this environment.

---

## ✨ Solution 1: Build Locally (Recommended for Development)

### Prerequisites
- Windows, Mac, or Linux (x86_64) computer
- Android Studio installed
- Node.js and npm/yarn installed

### Steps:

1. **Clone or download this repository to your local machine**

2. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

3. **Install dependencies:**
   ```bash
   yarn install
   ```

4. **Build the web assets:**
   ```bash
   yarn build
   ```

5. **Sync with Capacitor:**
   ```bash
   npx cap sync android
   ```

6. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```

7. **Build APK in Android Studio:**
   - Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Wait for the build to complete
   - Click "locate" in the notification to find your APK
   - APK location: `frontend/android/app/build/outputs/apk/debug/app-debug.apk`

### Alternative: Command Line Build (Local)
```bash
cd frontend/android
./gradlew assembleDebug
```
The APK will be at: `frontend/android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🚀 Solution 2: Automated CI/CD with GitHub Actions (Recommended for Production)

I've created a GitHub Actions workflow that automatically builds your APK when you push code.

### Setup:

1. **Push your code to GitHub** (if not already done)

2. **The workflow file is already created** at `.github/workflows/build-apk.yml`

3. **On every push**, GitHub Actions will:
   - Build your React app
   - Sync with Capacitor
   - Build the Android APK
   - Upload it as an artifact

4. **Download your APK:**
   - Go to your repository on GitHub
   - Click on "Actions" tab
   - Click on the latest workflow run
   - Download the APK from "Artifacts" section

### Trigger Manual Build:
- Go to Actions → "Build Android APK" → "Run workflow"

---

## 📦 Solution 3: Build Using EAS (Expo Application Services)

### One-Time Setup:
```bash
npm install -g eas-cli
eas login
```

### Build APK:
```bash
cd frontend
eas build --platform android --profile preview
```

Note: This requires an Expo account (free tier available)

---

## 🔧 Solution 4: Use Capacitor Cloud Build (Appflow)

Ionic offers a cloud build service called Appflow:
1. Sign up at https://ionic.io/appflow
2. Connect your repository
3. Configure build settings
4. Trigger builds from the dashboard

---

## 📱 Testing Your APK

### Install on Android Device:

1. **Enable Developer Options** on your Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times

2. **Enable USB Debugging**:
   - Settings → Developer Options → USB Debugging

3. **Install the APK**:
   ```bash
   adb install app-debug.apk
   ```

   Or transfer the APK to your device and install manually

### Testing Checklist:
- [ ] App launches successfully
- [ ] Backend API connection works
- [ ] Authentication flow functions
- [ ] All features accessible
- [ ] AdMob ads display (if configured)
- [ ] No crashes or errors

---

## 🏗️ Building for Production (Release APK/AAB)

### 1. Create a Keystore:
```bash
keytool -genkey -v -keystore lucksy-release-key.keystore -alias lucksy -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Gradle:
Create `frontend/android/gradle.properties` (local):
```properties
LUCKSY_UPLOAD_STORE_FILE=lucksy-release-key.keystore
LUCKSY_UPLOAD_KEY_ALIAS=lucksy
LUCKSY_UPLOAD_STORE_PASSWORD=your_store_password
LUCKSY_UPLOAD_KEY_PASSWORD=your_key_password
```

### 3. Update `frontend/android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('LUCKSY_UPLOAD_STORE_FILE')) {
                storeFile file(LUCKSY_UPLOAD_STORE_FILE)
                storePassword LUCKSY_UPLOAD_STORE_PASSWORD
                keyAlias LUCKSY_UPLOAD_KEY_ALIAS
                keyPassword LUCKSY_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 4. Build Release:
```bash
cd frontend/android
./gradlew assembleRelease
```

### 5. Generate AAB for Google Play:
```bash
./gradlew bundleRelease
```

---

## 🎯 Current Project Structure

```
/app/
├── frontend/
│   ├── android/              ✅ Android project (ready)
│   │   ├── app/
│   │   │   └── build/
│   │   │       └── outputs/
│   │   │           └── apk/  ← APK will be here
│   │   └── gradlew           ✅ Gradle wrapper
│   ├── build/                ✅ Web assets (built)
│   ├── capacitor.config.ts   ✅ Configured
│   └── src/                  ✅ React app source
└── backend/                  ✅ FastAPI backend (deployed)
```

---

## 🔍 Troubleshooting

### "Unable to install APK"
- Enable "Install from Unknown Sources" on your device
- Check storage space
- Ensure USB debugging is enabled

### "App crashes on startup"
- Check backend URL in capacitor.config.ts
- Verify all dependencies are installed
- Check logcat: `adb logcat`

### "Build fails with Gradle errors"
- Clear Gradle cache: `cd android && ./gradlew clean`
- Update Android SDK: Open Android Studio → SDK Manager
- Check Java version: `java -version` (should be 11 or 17)

---

## 📞 Need Help?

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Android Studio**: https://developer.android.com/studio
- **GitHub Actions**: https://docs.github.com/en/actions

---

## Next Steps

1. Choose your preferred build method from above
2. Follow the steps for that method
3. Test the APK on a real device
4. If satisfied, proceed with production build for Play Store

**Your Android project is fully configured and ready to build! 🎉**
