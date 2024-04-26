// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "project-rg-estate.firebaseapp.com",
  projectId: "project-rg-estate",
  storageBucket: "project-rg-estate.appspot.com",
  messagingSenderId: "320186698105",
  appId: "1:320186698105:web:df4557378f9de2e32407a8",
  measurementId: "G-916QJCHYZQ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
