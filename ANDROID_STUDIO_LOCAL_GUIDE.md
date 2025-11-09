# 📱 Build APK with Android Studio on Your Computer

## Prerequisites
- Android Studio installed on your computer
- Computer must be x86_64 (Windows, Mac Intel/M1, or Linux x86_64)

## Method 1: Clone Repository

### Step 1: Clone to Your Computer
```bash
git clone YOUR_REPO_URL
cd YOUR_PROJECT
```

### Step 2: Install Dependencies
```bash
cd frontend
npm install
# or: yarn install
```

### Step 3: Build Web Assets
```bash
npm run build
# or: yarn build
```

### Step 4: Sync Capacitor
```bash
npx cap sync android
```

### Step 5: Open in Android Studio
```bash
npx cap open android
```

### Step 6: Build APK in Android Studio
1. Wait for Gradle sync to complete
2. Click **Build** menu → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for build (usually 2-5 minutes)
4. Click "locate" link in the notification
5. Your APK is at: `frontend/android/app/build/outputs/apk/debug/app-debug.apk`

---

## Method 2: Export Package from Here

### Step 1: Create Export Package
```bash
# Run this in the current environment
./package-for-build.sh
```

### Step 2: Download Files
Download these from the current environment:
- `lucksy-android-export.zip` (for Windows)
- `lucksy-android-export.tar.gz` (for Mac/Linux)

### Step 3: Extract on Your Computer
```bash
# Windows: Extract the zip file
# Mac/Linux:
tar -xzf lucksy-android-export.tar.gz
cd lucksy-android-export
```

### Step 4: Open in Android Studio
1. Open Android Studio
2. Click "Open an Existing Project"
3. Navigate to `lucksy-android-export/android/`
4. Click "OK"

### Step 5: Build APK
Same as Method 1, Step 6 above.

---

## Troubleshooting

### "SDK Location Not Found"
1. File → Project Structure
2. Set Android SDK location
3. Click OK and retry

### "Gradle Sync Failed"
1. File → Invalidate Caches / Restart
2. Wait for Android Studio to restart
3. Let Gradle sync again

### "Build Failed"
```bash
# In Android Studio Terminal:
./gradlew clean
./gradlew assembleDebug
```

---

## After Building

Your APK will be at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

Transfer to your Android phone and install!
