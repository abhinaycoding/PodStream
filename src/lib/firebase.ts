import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || "podium-app-3562c.firebaseapp.com",
  projectId: "podium-app-3562c",
  storageBucket: "podium-app-3562c.firebasestorage.app",
  messagingSenderId: "315371866600",
  appId: "1:315371866600:web:c4ee785a6775a2922efc5d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
