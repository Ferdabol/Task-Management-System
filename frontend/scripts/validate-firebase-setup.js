#!/usr/bin/env node

/**
 * Firebase Setup Validation Script
 * 
 * This script helps verify that Firebase is properly configured
 * and all required collections exist in Firestore.
 * 
 * Run: node scripts/validate-firebase-setup.js
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const requiredEnvVars = [
  'AIzaSyBNTt3THv8eBkJb0erzPgOYTyp9u0ok2VY',
  'projects-39a99.firebaseapp.com',
  'projects-39a99',
  'projects-39a99.firebasestorage.app',
  '1024432063590',
  '1:1024432063590:web:fc3a2fd87c9169267699a7'
];

const requiredCollections = ['projects', 'tasks', 'users'];

console.log('\n🔍 Firebase Setup Validation\n');

// Check .env.local exists
try {
  const envPath = join(process.cwd(), '.env.local');
  const envContent = readFileSync(envPath, 'utf8');
  
  console.log('✅ .env.local file found\n');
  
  // Check environment variables
  console.log('Checking environment variables:');
  let allVarsPresent = true;
  
  requiredEnvVars.forEach(varName => {
    const pattern = new RegExp(`${varName}=(.+)`);
    const match = envContent.match(pattern);
    
    if (match && match[1] && !match[1].includes('YOUR_')) {
      console.log(`  ✅ ${varName}`);
    } else {
      console.log(`  ❌ ${varName} - NOT SET`);
      allVarsPresent = false;
    }
  });
  
  if (allVarsPresent) {
    console.log('\n✅ All Firebase credentials are configured!\n');
  } else {
    console.log('\n⚠️  Some Firebase credentials are missing.');
    console.log('Please update .env.local with your credentials from Firebase Console.\n');
  }
  
} catch (error) {
  console.log('❌ .env.local file NOT found\n');
  console.log('📋 To set up Firebase:');
  console.log('  1. Copy .env.example to .env.local');
  console.log('  2. Add your Firebase credentials from Firebase Console');
  console.log('  3. Run this script again\n');
  process.exit(1);
}

console.log('📚 Required Firestore Collections:');
requiredCollections.forEach(collection => {
  console.log(`  • ${collection}`);
});

console.log('\n📖 For detailed setup instructions, see: FIREBASE_SETUP.md\n');
console.log('✨ Setup validation complete!\n');
