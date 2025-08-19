// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "stylegenius-w74vy",
  appId: "1:63487268645:web:e990a0ba19691c3cf52ccc",
  storageBucket: "stylegenius-w74vy.firebasestorage.app",
  apiKey: "AIzaSyCnjnrSiVsyR_P-RPXtgu8LogCQSwvtEAk",
  authDomain: "stylegenius-w74vy.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "63487268645"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
