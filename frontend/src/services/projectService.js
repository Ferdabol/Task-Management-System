/**
 * Projects Service - Firestore Operations
 * 
 * Handles all CRUD operations for projects collection.
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

const PROJECTS_COLLECTION = 'projects';

/**
 * Create a new project
 * @param {Object} projectData - { name, description, status, startDate, endDate }
 * @returns {Promise<string>} - Document ID of created project
 */
export const createProject = async (projectData) => {
  try {
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
      ...projectData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error(`Failed to create project: ${error.message}`);
  }
};

/**
 * Get all projects
 * @returns {Promise<Array>} - Array of project objects with IDs
 */
export const getAllProjects = async () => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, PROJECTS_COLLECTION),
        orderBy('createdAt', 'desc')
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }
};

/**
 * Get a single project by ID
 * @param {string} projectId - Project document ID
 * @returns {Promise<Object>} - Project object with ID
 */
export const getProjectById = async (projectId) => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Project not found');
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    throw new Error(`Failed to fetch project: ${error.message}`);
  }
};

/**
 * Update a project
 * @param {string} projectId - Project document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateProject = async (projectId, updates) => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error(`Failed to update project: ${error.message}`);
  }
};

/**
 * Delete a project
 * @param {string} projectId - Project document ID
 * @returns {Promise<void>}
 */
export const deleteProject = async (projectId) => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error(`Failed to delete project: ${error.message}`);
  }
};

/**
 * Set up real-time listener for all projects
 * @param {Function} callback - Callback function that receives projects array
 * @returns {Function} - Unsubscribe function to stop listening
 */
export const subscribeToProjects = (callback) => {
  try {
    const unsubscribe = onSnapshot(
      query(
        collection(db, PROJECTS_COLLECTION),
        orderBy('createdAt', 'desc')
      ),
      (querySnapshot) => {
        const projects = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(projects);
      },
      (error) => {
        console.error('Error subscribing to projects:', error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up projects listener:', error);
    throw new Error(`Failed to subscribe to projects: ${error.message}`);
  }
};

/**
 * Get projects by status
 * @param {string} status - Project status (active, completed, on-hold)
 * @returns {Promise<Array>} - Array of filtered projects
 */
export const getProjectsByStatus = async (status) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, PROJECTS_COLLECTION),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching projects by status:', error);
    throw new Error(`Failed to fetch projects by status: ${error.message}`);
  }
};
