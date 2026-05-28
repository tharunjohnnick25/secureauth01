# SecureAuth Google Authentication Setup Guide (Web & Android)

This folder contains the complete, production-ready source code files and setup parameters to deploy Google Sign-in for SecureAuth across both standard Web and Android devices.

---

## 🛠️ Step 1: Firebase Project Setup

1. Open the [Firebase Console](https://console.firebase.google.com/) and create a new project named **SecureAuth-Production**.
2. Navigate to **All Products** -> **Authentication** and click **Get Started**.
3. Under the **Sign-in method** tab, select **Google** from the list of provider options:
   - Toggle **Enable** to True.
   - Enter your corporate Support Email address.
   - Click **Save**.
4. In the **Project Settings** (gear icon next to Project Overview):
   - Scroll down to **Your apps** and click **Add app** (Select **Web** symbol).
   - Register the app name `SecureAuth-Web` and copy the configuration snippet (inject these into your client-side environment variables).
   - Add another app by clicking **Add app** (Select **Android** symbol).
   - Enter your Android package identifier (e.g. `com.secureauth.app`).
   - Download the generated `google-services.json` file and place it in the Flutter project directory at `android/app/google-services.json`.

---

## 🔑 Step 2: Google Cloud Console Configuration

1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your Firebase project from the top dropdown list.
3. Search for and navigate to **APIs & Services** -> **Credentials**.
4. Under **OAuth 2.0 Client IDs**:
   - Locate the auto-generated **Web client (created by Google Service)**.
   - Click edit (pencil icon) to copy the **Client ID** and **Client Secret** (use these for your backend configurations).
   - Under **Authorized redirect URIs**, add your production domain hook: `https://auth.secureauth.com/__/auth/handler` (Firebase redirect endpoint).

---

## 📱 Step 3: Google Play Store SHA Fingerprint Setup

To enable Google Sign-In inside Android mobile application release builds (APK/AAB) on the Play Store, you must map your SHA fingerprints inside your Firebase Console:

1. **Obtaining SHA-1/SHA-256 for Debug Mode**:
   Open a terminal in your Flutter directory and execute:
   ```bash
   cd android
   ./gradlew signingReport
   ```
   Copy the `SHA-1` and `SHA-256` keys outputted under the `debugAndroidTest` block.

2. **Obtaining SHA-1/SHA-256 for Production (Google Play Console)**:
   - Log in to your [Google Play Console](https://play.google.com/console/).
   - Navigate to your application -> **Release** -> **Setup** -> **App Integrity**.
   - Under **App signing key certificate**, copy the `SHA-1` and `SHA-256` fingerprints.

3. **Map Keys in Firebase**:
   - Return to your **Firebase Project Settings** -> **Your Apps** (Android App).
   - Click **Add fingerprint**.
   - Paste the Debug and Production SHA-1 & SHA-256 key fingerprints.
   - Redownload the `google-services.json` and replace it in the Flutter directory.

---

## 🌐 Step 4: Environment Variables Setup

### Web / Frontend Environment (`.env.local`)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDummyKey_123456789
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=secureauth-production.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=secureauth-production
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=secureauth-production.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

### Express Backend Environment (`.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://admin:securepassword@cluster0.secureauth.mongodb.net/prod
JWT_SECRET=secureauth_super_secret_jwt_key
FIREBASE_PROJECT_ID=secureauth-production
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@secureauth-production.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6...-----END PRIVATE KEY-----\n"
```

---

## 📂 Step 5: Production Directory Structure

Integrate these files into your corporate repositories using the following structure:

```text
├── secureauth-backend/          # Node.js + Express API
│   ├── config/
│   │   └── firebase-admin.json  # Firebase Admin Private Credentials
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── routes/
│   │   └── auth.js             # Google auth login verification route
│   ├── models/
│   │   └── User.js             # MongoDB user schema
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── secureauth-frontend-web/     # React + Vite Web Portal
│   ├── src/
│   │   ├── components/
│   │   │   └── GoogleAuthButton.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── firebase/
│   │   │   └── client.ts
│   │   └── App.tsx
│
└── secureauth-flutter-app/      # Flutter Android App
    ├── android/
    │   └── app/
    │       └── google-services.json # Firebase android parameters
    └── lib/
        ├── services/
        │   └── google_auth_service.dart
        ├── widgets/
        │   └── google_sign_in_button.dart
        └── main.dart
```
