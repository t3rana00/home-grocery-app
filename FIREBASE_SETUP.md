# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **Add project** or **Create a project**
3. Enter project name: `home-grocery-app`
4. Click **Continue**
5. Disable Google Analytics (optional)
6. Click **Create project**

## Step 2: Register Your Web App

1. In Firebase Console, click the **Web icon** (</>) to add a web app
2. Enter app nickname: `Home Grocery Web`
3. Check **Also set up Firebase Hosting** (optional)
4. Click **Register app**
5. Copy the `firebaseConfig` object

## Step 3: Enable Firestore Database

1. In Firebase Console sidebar, click **Build** → **Firestore Database**
2. Click **Create database**
3. Select **Start in test mode** (for development)
4. Choose a location (closest to you)
5. Click **Enable**

## Step 4: Set Firestore Security Rules

In Firestore → **Rules** tab, paste this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if true; // For testing - anyone can access
      // Later, update to: allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **Publish**

## Step 5: Update Your App Configuration

1. Open `src/firebase/config.ts`
2. Replace the placeholder values with your Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## Step 6: Switch to Firebase Hooks

Open `src/App.tsx` and change imports:

**From:**
```typescript
import { useMissingItems, useShoppingList, useBills } from './hooks/useLocalStorage';
```

**To:**
```typescript
import { useFirebaseMissingItems as useMissingItems, useFirebaseShoppingList as useShoppingList, useFirebaseBills as useBills } from './firebase/firebaseHooks';
```

**OR simply update the hooks calls to:**
```typescript
const missingItems = useMissingItems('guest'); // Use 'guest' or actual user ID
const shoppingList = useShoppingList('guest');
const bills = useBills('guest');
```

## Step 7: Test Your App

1. Run: `npm run dev`
2. Open http://localhost:5173
3. Add items - they should save to Firebase!
4. Check Firebase Console → Firestore Database to see your data

## Step 8: Enable Authentication (Optional)

To add user login:

1. Firebase Console → **Build** → **Authentication**
2. Click **Get started**
3. Enable **Email/Password** or **Google** sign-in
4. Update security rules to require authentication

## Optional: Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

## Benefits of Firebase

✅ **Real-time sync** - Data updates instantly across all devices
✅ **Cloud backup** - Data never lost
✅ **Multi-device** - Access from phone, tablet, computer
✅ **User authentication** - Add login later
✅ **Free tier** - Good for personal use
✅ **Scalable** - Grows with your needs

## Current Setup

- Data is stored per user with `userId`
- Currently using `'guest'` as default user ID
- To add authentication, replace `'guest'` with actual user ID after login
- Real-time listeners keep UI in sync automatically
