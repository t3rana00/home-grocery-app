import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEw00vYFgdqwoG9Ftb5lssl1jrr2V_CFc",
  authDomain: "home-grocery-app-19cec.firebaseapp.com",
  projectId: "home-grocery-app-19cec",
  storageBucket: "home-grocery-app-19cec.firebasestorage.app",
  messagingSenderId: "479321173018",
  appId: "1:479321173018:web:fe5a6598bab79ef17e75a3",
  measurementId: "G-6DKMG22L4R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);

export default app;
