import { initializeApp } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"

// Firebase is used only for the admin login and the text content (menu,
// offers, gallery entries, About page). Photos live on Cloudinary — see
// src/lib/storage.ts.
//
// Public config — safe to expose in client code. Real security comes
// from the Firestore rules (see firestore.rules in this project, which you
// paste into the Firebase console).
const firebaseConfig = {
  apiKey: "AIzaSyAMfcgA93rjA0Urrm8KdL4C1nMPEte8H8I",
  authDomain: "mairaj-restaruant.firebaseapp.com",
  projectId: "mairaj-restaruant",
  storageBucket: "mairaj-restaruant.firebasestorage.app",
  messagingSenderId: "805541131117",
  appId: "1:805541131117:web:3fdfe6432eb662e7aae064",
  measurementId: "G-WPR25FHF30",
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// When running with VITE_USE_EMULATOR=true, talk to the local Firebase
// emulators instead of the real cloud project. Never happens in production.
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === "true") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true })
  connectFirestoreEmulator(db, "127.0.0.1", 8080)
  console.log("🔥 Using local Firebase emulators")
}
