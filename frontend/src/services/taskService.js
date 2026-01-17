/**
 * Tasks Service - Firestore Operations
 * 
 * Handles all CRUD operations for tasks collection.
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

const TASKS_COLLECTION = 'tasks';

/**
 * Create a new task
 * @param {Object} taskData - { title, description, projectId, assignedTo, status, priority, deadline }
 * @returns {Promise<string>} - Document ID of created task
 */
export const createTask = async (taskData) => {
  try {
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
      ...taskData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error(`Failed to create task: ${error.message}`);
  }
};

/**
 * Get all tasks
 * @returns {Promise<Array>} - Array of task objects with IDs
 */
export const getAllTasks = async () => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, TASKS_COLLECTION),
        orderBy('createdAt', 'desc')
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }
};

/**
 * Get a single task by ID
 * @param {string} taskId - Task document ID
 * @returns {Promise<Object>} - Task object with ID
 */
export const getTaskById = async (taskId) => {
  try {
    const docRef = doc(db, TASKS_COLLECTION, taskId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Task not found');
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  } catch (error) {
    console.error('Error fetching task:', error);
    throw new Error(`Failed to fetch task: ${error.message}`);
  }
};

/**
 * Update a task
 * @param {string} taskId - Task document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateTask = async (taskId, updates) => {
  try {
    const docRef = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error(`Failed to update task: ${error.message}`);
  }
};

/**
 * Delete a task
 * @param {string} taskId - Task document ID
 * @returns {Promise<void>}
 */
export const deleteTask = async (taskId) => {
  try {
    const docRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error(`Failed to delete task: ${error.message}`);
  }
};

/**
 * Set up real-time listener for all tasks
 * @param {Function} callback - Callback function that receives tasks array
 * @returns {Function} - Unsubscribe function to stop listening
 */
export const subscribeToTasks = (callback) => {
  try {
    const unsubscribe = onSnapshot(
      query(
        collection(db, TASKS_COLLECTION),
        orderBy('createdAt', 'desc')
      ),
      (querySnapshot) => {
        const tasks = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(tasks);
      },
      (error) => {
        console.error('Error subscribing to tasks:', error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up tasks listener:', error);
    throw new Error(`Failed to subscribe to tasks: ${error.message}`);
  }
};

/**
 * Get tasks by status
 * @param {string} status - Task status (pending, in-progress, completed)
 * @returns {Promise<Array>} - Array of filtered tasks
 */
export const getTasksByStatus = async (status) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, TASKS_COLLECTION),
        where('status', '==', status)
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching tasks by status:', error);
    throw new Error(`Failed to fetch tasks by status: ${error.message}`);
  }
};

/**
 * Get tasks by project ID
 * @param {string} projectId - Project document ID
 * @returns {Promise<Array>} - Array of tasks for the project
 */
export const getTasksByProject = async (projectId) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, TASKS_COLLECTION),
        where('projectId', '==', projectId)
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching tasks by project:', error);
    throw new Error(`Failed to fetch tasks by project: ${error.message}`);
  }
};

/**
 * Get tasks assigned to a user
 * @param {string} userId - User document ID
 * @returns {Promise<Array>} - Array of tasks assigned to the user
 */
export const getTasksByAssignee = async (userId) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, TASKS_COLLECTION),
        where('assignedTo', '==', userId)
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching tasks by assignee:', error);
    throw new Error(`Failed to fetch tasks by assignee: ${error.message}`);
  }
};

/**
 * Get overdue tasks (incomplete tasks with deadline in past)
 * @returns {Promise<Array>} - Array of overdue tasks
 */
export const getOverdueTasks = async () => {
  try {
    const now = new Date();
    const allTasks = await getAllTasks();
    const overdueTasks = allTasks.filter(task => {
      if (task.status === 'completed') return false;
      const deadline = new Date(task.deadline);
      return deadline < now;
    });
    return overdueTasks;
  } catch (error) {
    console.error('Error fetching overdue tasks:', error);
    throw new Error(`Failed to fetch overdue tasks: ${error.message}`);
  }
};
