// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9JhfkDX6FjawEd0Qwk1RIVIK7MoWWKcQ",
  authDomain: "citationsapps.firebaseapp.com",
  projectId: "citationsapps",
  storageBucket: "citationsapps.firebasestorage.app",
  messagingSenderId: "53122304670",
  appId: "1:53122304670:web:9e87abeee84ecd3b6b898f",
  measurementId: "G-45Y5M7D4FH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);