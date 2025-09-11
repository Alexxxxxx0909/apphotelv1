import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxEtVHxOlBJ3Diyhxmn5jhki1Optxpm-A",
  authDomain: "bloom-suites.firebaseapp.com",
  projectId: "bloom-suites",
  storageBucket: "bloom-suites.firebasestorage.app",
  messagingSenderId: "992347267947",
  appId: "1:992347267947:web:95082d5e0365169bde622e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;