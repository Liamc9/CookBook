// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore"
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9Wgg7bCrnWWGT2VJsP47zVt3GKseDLBg",
  authDomain: "cookbook-3f0ee.firebaseapp.com",
  projectId: "cookbook-3f0ee",
  storageBucket: "cookbook-3f0ee.appspot.com",
  messagingSenderId: "745536820837",
  appId: "1:745536820837:web:39bb4022baf1ad7ee4988c",
  measurementId: "G-2XWJ4GBPEY"
};

// Initialize Firebase and Export
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
