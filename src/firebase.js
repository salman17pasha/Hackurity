import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyARpHKlc9o4U9FD78CjaVm7ZihFlrSGJOk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hackurity-4c67e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hackurity-4c67e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hackurity-4c67e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1094618335860",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1094618335860:web:5fe9950f98c1096afedf21",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-W9VGC10VNZ"
}

// Initialize Firebase safely for singletons
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
