// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAoPPCQ7MTWo813amShiZjcragL737OwsA",
  authDomain: "inventory-pantry-app.firebaseapp.com",
  projectId: "inventory-pantry-app",
  storageBucket: "inventory-pantry-app.appspot.com",
  messagingSenderId: "319944060757",
  appId: "1:319944060757:web:3824c52f5169dd436b09dc",
  measurementId: "G-TJ0QL2HDBP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const firestore = getFirestore(app);


export { firestore };
