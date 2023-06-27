import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NODE_ENV === 'production' ? process.env.VITE_API_KEY : import.meta.env.VITE_API_KEY,
    authDomain: process.env.NODE_ENV === 'production' ? process.env.VITE_AUTH_DOMAIN : import.meta.env.VITE_AUTH_DOMAIN,
    projectId: process.env.NODE_ENV === 'production' ? process.env.VITE_PROJECT_ID : import.meta.env.VITE_PROJECT_ID,
    storageBucket: process.env.NODE_ENV === 'production' ? process.env.VITE_STORAGE_BUCKET : import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: process.env.NODE_ENV === 'production' ? process.env.VITE_MESSAGING_SENDER_ID : import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: process.env.NODE_ENV === 'production' ? process.env.VITE_APP_ID : import.meta.env.VITE_APP_ID
};

export const Firebase = initializeApp(firebaseConfig);

export const auth = getAuth(Firebase);

export const db = getFirestore(Firebase);