import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Public config — safe to expose in client code. Real security comes
// from the Firestore/Storage rules (see firestore.rules and storage.rules
// in this project, which you paste into the Firebase console).
const firebaseConfig = {
  apiKey: "AIzaSyD4SqfEwXxR6js6tkCbgAVdXO0TSohdTZo",
  authDomain: "mairaj-resturant.firebaseapp.com",
  projectId: "mairaj-resturant",
  storageBucket: "mairaj-resturant.firebasestorage.app",
  messagingSenderId: "384018830796",
  appId: "1:384018830796:web:cd311a55f76fabd52e7969",
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
