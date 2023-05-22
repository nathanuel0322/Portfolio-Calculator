import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc, collection,addDoc } from "firebase/firestore";
import {ref, getStorage, uploadBytes, } from "firebase/storage";

// Optionally import the services that you want to use

//import {...} from "firebase/database";
//import {...} from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBMtnQaBLDyA_XlBb2LIINGmQ1PixxplUw",
    authDomain: "portfolio-calculator-2c0bc.firebaseapp.com",
    projectId: "portfolio-calculator-2c0bc",
    storageBucket: "portfolio-calculator-2c0bc.appspot.com",
    messagingSenderId: "362546081709",
    appId: "1:362546081709:web:c68af94570384ac8883b24"
};

// Initialize Firebase
export const Firebase = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(Firebase);

export const db = getFirestore(Firebase);
// getDoc(doc(firestore, "Businesses", "BizData"))
// // .then is genuinely the most essential thing here as it threw me off for hours
//   .then(result => Globals.businesses=result.data());