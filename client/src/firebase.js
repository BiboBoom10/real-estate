// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "boom-estate-6d560.firebaseapp.com",
  projectId: "boom-estate-6d560",
  storageBucket: "boom-estate-6d560.appspot.com",
  messagingSenderId: "335462377260",
  appId: "1:335462377260:web:acd5df79d51c2dd2a1ae89"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);