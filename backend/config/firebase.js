require('dotenv').config();
const admin = require('firebase-admin');
const path = require('path');

// Clear GOOGLE_APPLICATION_CREDENTIALS to prevent looking for old file
delete process.env.GOOGLE_APPLICATION_CREDENTIALS;

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Use serviceAccountKey.json file if it exists
    const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
    const serviceAccount = require(serviceAccountPath);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    console.log('Firebase initialized with serviceAccountKey.json');
  } catch (error) {
    console.error('Error loading serviceAccountKey.json:', error.message);
    console.error('Attempting to initialize with environment variables...');
    
    try {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined;

      if (!process.env.FIREBASE_PROJECT_ID || !privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
        throw new Error('Missing Firebase credentials in environment variables');
      }

      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      });
      
      console.log('Firebase initialized with environment variables');
    } catch (envError) {
      console.error('Failed to initialize Firebase:', envError.message);
      throw envError;
    }
  }
}

const db = admin.firestore();

module.exports = { admin, db };
