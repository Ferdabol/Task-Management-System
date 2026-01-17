/**
 * Firebase Configuration and Initialization
 * 
 * This file contains the Firebase SDK setup using modular SDK v9+.
 * Add your Firebase credentials to the environment variables:
 * - VITE_FIREBASE_API_KEY
 * - VITE_FIREBASE_AUTH_DOMAIN
 * - VITE_FIREBASE_PROJECT_ID
 * - VITE_FIREBASE_STORAGE_BUCKET
 * - VITE_FIREBASE_MESSAGING_SENDER_ID
 * - VITE_FIREBASE_APP_ID
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration - uses environment variables
// These should be set in .env.local file
const firebaseConfig = {
  apiKey: "AIzaSyBNTt3THv8eBkJb0erzPgOYTyp9u0ok2VY",
  authDomain: "projects-39a99.firebaseapp.com",
  projectId: "projects-39a99",
  storageBucket: "projects-39a99.firebasestorage.app",
  messagingSenderId: "1024432063590",
  appId: "1:1024432063590:web:fc3a2fd87c9169267699a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Export app instance for other uses if needed
export default app;
