// lib/firebase.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  type Auth
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ⚠️ IMPORTANT: use require (fixes TS error)
const { getReactNativePersistence } = require("firebase/auth");

// 🔥 Config
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,

  authDomain: "gloows-03b6sz.firebaseapp.com",
  projectId: "gloows-03b6sz",
  storageBucket: "gloows-03b6sz.firebasestorage.app",
  messagingSenderId: "1039247674814",
  appId: "1:1039247674814:web:071d5c2982065f6712bdef"
};

// ✅ Initialize app
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// ✅ FIX TYPE
let auth: Auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

// ✅ Firestore
const db = getFirestore(app);

export { auth, db };
export const storage = getStorage(app);

import { getFunctions } from "firebase/functions";
export const functions = getFunctions(app);