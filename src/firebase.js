import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//API Keys
const firebaseConfig = {
  apiKey: "AIzaSyADvL8tvH_KuNMeDiyTdaOumQ54N_rUWJ8",
  authDomain: "adea-car-rental.firebaseapp.com",
  projectId: "adea-car-rental",
  storageBucket: "adea-car-rental.firebasestorage.app",
  messagingSenderId: "1000119502866",
  appId: "1:1000119502866:web:e10c26162a1264e91970cb"
};

// Executing Firebase 
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);