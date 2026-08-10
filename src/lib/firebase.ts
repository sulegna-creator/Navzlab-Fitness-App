import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "shaped-xylopolist-5q6d2",
  appId: "1:410660970265:web:10baa4ca9050a3e70aef88",
  apiKey: "AIzaSyDCPDplwnlrhPpNQPoQjcxHP5yWfZw6uVg",
  authDomain: "shaped-xylopolist-5q6d2.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-navzlabhealthand-2a49c6ee-b720-4c33-8873-ee14cefb017b",
  storageBucket: "shaped-xylopolist-5q6d2.firebasestorage.app",
  messagingSenderId: "410660970265"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
