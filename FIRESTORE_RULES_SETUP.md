# Firestore Security Rules Setup

## Problem
Getting error: `[FirebaseError: Missing or insufficient permissions.]`

## Solution
You need to update your Firestore Security Rules to allow authenticated users to access their own student profiles.

## Steps to Deploy

### 1. Go to Firebase Console
- Visit https://console.firebase.google.com
- Select your Vidya project

### 2. Navigate to Firestore Rules
- In the left sidebar: **Build** → **Firestore Database**
- Click on the **Rules** tab

### 3. Replace Rules with THIS (copy the content from firestore.rules file):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 🔒 STUDENTS - Users can only read/write their own profile
    match /students/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // 🔒 POSTS - Everyone can read, only owner can write
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;

      // Likes subcollection - Users can like/unlike
      match /likes/{userId} {
        allow read: if request.auth != null;
        allow write: if request.auth.uid == userId;
      }
    }

    // 🔒 USERS - Legacy, keep for now
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // 🔒 Default deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 4. Click "Publish"

## What This Does
✅ Authenticated users can read/write their own student profile  
✅ Users can read all posts (for feed)  
✅ Users can only write/update their own posts  
✅ Users can like posts  
✅ Blocks all unauthorized access  

## Testing
After deploying, try logging in again. The permission error should be resolved!
