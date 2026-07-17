import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const getEnvVal = (val: string | undefined, fallback: string): string => {
  if (!val || val === 'undefined' || val === 'null' || val.trim() === '') {
    return fallback;
  }
  return val;
};

const firebaseConfig = {
  apiKey: getEnvVal(import.meta.env.VITE_FIREBASE_API_KEY, "AIzaSyDSgNNKs33NWHM6OpQZKIQiZxBLO39g_iw"),
  authDomain: getEnvVal(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, "playcode-39ce5.firebaseapp.com"),
  projectId: getEnvVal(import.meta.env.VITE_FIREBASE_PROJECT_ID, "playcode-39ce5"),
  storageBucket: getEnvVal(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, "playcode-39ce5.firebasestorage.app"),
  messagingSenderId: getEnvVal(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, "876879571735"),
  appId: getEnvVal(import.meta.env.VITE_FIREBASE_APP_ID, "1:876879571735:web:03ff4556cf019f7c56a552"),
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
