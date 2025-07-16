// Firebase Configuration - Configuración real del proyecto
const firebaseConfig = {
  apiKey: "AIzaSyDDh3yYNj9Cg29T-wzIhBRnOTvrWCabdBM",
  authDomain: "mi-b-99ca8.firebaseapp.com",
  databaseURL: "https://mi-b-99ca8-default-rtdb.firebaseio.com",
  projectId: "mi-b-99ca8",
  storageBucket: "mi-b-99ca8.firebasestorage.app",
  messagingSenderId: "164430405479",
  appId: "1:164430405479:web:bedd6d831f9df3b2eb19c2",
  measurementId: "G-2G92YVLZTR"
};

// Inicializar Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
