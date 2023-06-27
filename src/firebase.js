import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

console.log("process.env.NODE_ENV:", process.env.NODE_ENV)
console.log("api key:", process.env.NODE_ENV === 'production' ? process.env.VITE_API_KEY : import.meta.env.VITE_API_KEY)
console.log("auth domain:", process.env.NODE_ENV === 'production' ? process.env.VITE_AUTH_DOMAIN : import.meta.env.VITE_AUTH_DOMAIN)
console.log("project id:", process.env.NODE_ENV === 'production' ? process.env.VITE_PROJECT_ID : import.meta.env.VITE_PROJECT_ID)
console.log("storage bucket:", process.env.NODE_ENV === 'production' ? process.env.VITE_STORAGE_BUCKET : import.meta.env.VITE_STORAGE_BUCKET)
console.log("messaging sender id:", process.env.NODE_ENV === 'production' ? process.env.VITE_MESSAGING_SENDER_ID : import.meta.env.VITE_MESSAGING_SENDER_ID)
console.log("app id:", process.env.NODE_ENV === 'production' ? process.env.VITE_APP_ID : import.meta.env.VITE_APP_ID)

const firebaseConfig = {
    // apiKey: process.env.NODE_ENV === 'production' ? process.env.VITE_API_KEY : import.meta.env.VITE_API_KEY,
    apiKey: import.meta.env.VITE_API_KEY,
    // authDomain: process.env.NODE_ENV === 'production' ? process.env.VITE_AUTH_DOMAIN : import.meta.env.VITE_AUTH_DOMAIN,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    // projectId: process.env.NODE_ENV === 'production' ? process.env.VITE_PROJECT_ID : import.meta.env.VITE_PROJECT_ID,
    projectId: import.meta.env.VITE_PROJECT_ID,
    // storageBucket: process.env.NODE_ENV === 'production' ? process.env.VITE_STORAGE_BUCKET : import.meta.env.VITE_STORAGE_BUCKET,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    // messagingSenderId: process.env.NODE_ENV === 'production' ? process.env.VITE_MESSAGING_SENDER_ID : import.meta.env.VITE_MESSAGING_SENDER_ID,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    // appId: process.env.NODE_ENV === 'production' ? process.env.VITE_APP_ID : import.meta.env.VITE_APP_ID
    appId: import.meta.env.VITE_APP_ID
};

export const Firebase = initializeApp(firebaseConfig);

export const auth = getAuth(Firebase);

export const db = getFirestore(Firebase);