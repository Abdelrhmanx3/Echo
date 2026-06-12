import { initializeApp, getApps, getApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyB-bfvGYDiFaJpwYRJK4rC3Be-3bJnjE6M",
  authDomain: "thread-1ce17.firebaseapp.com",
  databaseURL: "https://thread-1ce17-default-rtdb.firebaseio.com",
  projectId: "thread-1ce17",
  storageBucket: "thread-1ce17.firebasestorage.app",
  messagingSenderId: "684586623382",
  appId: "1:684586623382:web:c4da2124eeed71b1d9fdb7"
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const db = getDatabase(app)
export const auth = getAuth(app)