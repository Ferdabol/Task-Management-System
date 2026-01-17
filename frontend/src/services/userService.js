/**
 * Users Service - Firestore Operations
 * 
 * Handles all CRUD operations for users collection.
 * Uses Firestore v9+ modular SDK with async/await.
 */

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const USERS_COLLECTION = 'users';

/**
 * Create a new user
 * @param {Object} userData - { name, email, role, department }
 * @returns {Promise<string>} - Document ID of created user
 */
export const createUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, USERS_COLLECTION), {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

/**
 * Get all users
 * @returns {Promise<Array>} - Array of user objects with IDs
 */
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, USERS_COLLECTION),
        orderBy('createdAt', 'desc')
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};

/**
 * Get a single user by ID
 * @param {string} userId - User document ID
 * @returns {Promise<Object>} - User object with ID
 */
export const getUserById = async (userId) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('User not found');
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};

/**
 * Update a user
 * @param {string} userId - User document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateUser = async (userId, updates) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

/**
 * Delete a user
 * @param {string} userId - User document ID
 * @returns {Promise<void>}
 */
export const deleteUser = async (userId) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

/**
 * Set up real-time listener for all users
 * @param {Function} callback - Callback function that receives users array
 * @returns {Function} - Unsubscribe function to stop listening
 */
export const subscribeToUsers = (callback) => {
  try {
    const unsubscribe = onSnapshot(
      query(
        collection(db, USERS_COLLECTION),
        orderBy('createdAt', 'desc')
      ),
      (querySnapshot) => {
        const users = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(users);
      },
      (error) => {
        console.error('Error subscribing to users:', error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up users listener:', error);
    throw new Error(`Failed to subscribe to users: ${error.message}`);
  }
};

/**
 * Get users by role
 * @param {string} role - User role (manager, developer, designer, etc.)
 * @returns {Promise<Array>} - Array of filtered users
 */
export const getUsersByRole = async (role) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, USERS_COLLECTION),
        where('role', '==', role)
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching users by role:', error);
    throw new Error(`Failed to fetch users by role: ${error.message}`);
  }
};

/**
 * Get users by department
 * @param {string} department - Department name
 * @returns {Promise<Array>} - Array of filtered users
 */
export const getUsersByDepartment = async (department) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, USERS_COLLECTION),
        where('department', '==', department)
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching users by department:', error);
    throw new Error(`Failed to fetch users by department: ${error.message}`);
  }
};

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} - User object or null if not found
 */
export const getUserByEmail = async (email) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, USERS_COLLECTION),
        where('email', '==', email)
      )
    );
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error(`Failed to fetch user by email: ${error.message}`);
  }
};
