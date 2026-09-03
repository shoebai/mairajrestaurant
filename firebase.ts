import { initializeApp } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getStorage, connectStorageEmulator } from "firebase/storage"

// Public config — safe to expose in client code. Real security comes
// from the Firestore/Storage rules (see firestore.rules and storage.rules
// in this project, which you paste into the Firebase console).
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
export const storage = getStorage(app)

// When running via `docker compose up` (or `npm run dev` with
// VITE_USE_EMULATOR=true), talk to the local Firebase emulators instead
// of the real cloud project. Never happens in a production build.
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === "true") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true })
  connectFirestoreEmulator(db, "127.0.0.1", 8080)
  connectStorageEmulator(storage, "127.0.0.1", 9199)
  console.log("🔥 Using local Firebase emulators")
}
