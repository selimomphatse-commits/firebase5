import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAQsnQkh4M220YreJ1PxEpRv3OGbj-7JQ4",
  authDomain: "movies-74328.firebaseapp.com",
  projectId: "movies-74328",
  storageBucket: "movies-74328.firebasestorage.app",
  messagingSenderId: "217243145663",
  appId: "1:217243145663:web:a692ecb06a8b1240a0fd0a",
  measurementId: "G-3CF6X2B2WY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;