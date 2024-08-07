// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVOPdVSKYzCv_6ifAL8DPVV_AQar9jUnY",
  authDomain: "gestion-9c298.firebaseapp.com",
  projectId: "gestion-9c298",
  storageBucket: "gestion-9c298.appspot.com",
  messagingSenderId: "437376620852",
  appId: "1:437376620852:web:fa67a5222f300c45136d61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);