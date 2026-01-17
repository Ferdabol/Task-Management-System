# Task Management System - Firebase Integration Guide

## Overview
This Task Management System has been fully converted from local/mock data to a real Firebase-powered implementation using Firestore and Firebase Authentication. All CRUD operations now interact directly with Firebase.

## Project Structure

### Configuration
- **`src/config/firebase.js`** - Firebase SDK initialization and Firestore/Auth setup

### Service Layer (Database Operations)
- **`src/services/projectService.js`** - Project CRUD operations
- **`src/services/taskService.js`** - Task CRUD operations  
- **`src/services/userService.js`** - User CRUD operations

### Pages (UI Components)
- **`src/pages/Dashboard.jsx`** - Real-time dashboard with stats
- **`src/pages/Projects.jsx`** - Project management (Create, Read, Update, Delete)
- **`src/pages/Tasks.jsx`** - Task management with real-time updates
- **`src/pages/Users.jsx`** - User management

## Setup Instructions

### 1. Install Dependencies
```bash
npm install firebase
```

### 2. Firebase Configuration
1. Create a `.env.local` file in the `frontend` directory
2. Copy the template from `.env.example`
3. Add your Firebase credentials from Firebase Console:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Create Firestore Collections

Create the following collections in Firestore:

#### **projects** collection
Document structure:
```json
{
  "name": "string",
  "description": "string",
  "status": "active|completed|on-hold",
  "startDate": "string (date)",
  "endDate": "string (date)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### **tasks** collection
Document structure:
```json
{
  "title": "string",
  "description": "string",
  "projectId": "string (reference to projects)",
  "assignedTo": "string (reference to users) or empty",
  "status": "pending|in-progress|completed",
  "priority": "low|medium|high",
  "deadline": "string (date)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### **users** collection
Document structure:
```json
{
  "name": "string",
  "email": "string",
  "role": "developer|designer|manager|qa",
  "department": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 4. Run the Application
```bash
npm run dev
```

## Features

### Real-time Updates
- Dashboard updates in real-time as projects and tasks change
- Live listeners using `onSnapshot` for instant data sync

### Loading & Error States
- Proper loading indicators while fetching from Firestore
- Error messages for failed operations
- User feedback on submission

### CRUD Operations

#### Create
- Projects, Tasks, and Users can be created via modals
- Data is immediately saved to Firestore

#### Read
- Real-time listeners subscribe to collections
- Data is fetched and displayed automatically
- Proper null/empty state handling

#### Update
- Click "Edit" on any item to modify it
- Changes are immediately reflected in Firestore

#### Delete
- Confirmation dialog before deletion
- Soft deletion support via status field

### Helper Features
- **Dashboard** shows real-time statistics
- **Upcoming Deadlines** automatically sorted by deadline
- **Task Counts** dynamically calculated from Firestore queries
- **Overdue Detection** for incomplete tasks with past deadlines

## Database Operations API

### Project Service
```javascript
// Async operations
await createProject(projectData)           // Create new project
await getAllProjects()                     // Fetch all projects
await getProjectById(projectId)            // Fetch single project
await updateProject(projectId, updates)    // Update project
await deleteProject(projectId)             // Delete project
await getProjectsByStatus(status)          // Filter by status

// Real-time listeners
subscribeToProjects(callback)              // Listen for changes
```

### Task Service
```javascript
// Async operations
await createTask(taskData)                 // Create new task
await getAllTasks()                        // Fetch all tasks
await getTaskById(taskId)                  // Fetch single task
await updateTask(taskId, updates)          // Update task
await deleteTask(taskId)                   // Delete task
await getTasksByStatus(status)             // Filter by status
await getTasksByProject(projectId)         // Filter by project
await getTasksByAssignee(userId)           // Filter by assignee
await getOverdueTasks()                    // Get overdue tasks

// Real-time listeners
subscribeToTasks(callback)                 // Listen for changes
```

### User Service
```javascript
// Async operations
await createUser(userData)                 // Create new user
await getAllUsers()                        // Fetch all users
await getUserById(userId)                  // Fetch single user
await updateUser(userId, updates)          // Update user
await deleteUser(userId)                   // Delete user
await getUsersByRole(role)                 // Filter by role
await getUsersByDepartment(dept)           // Filter by department
await getUserByEmail(email)                // Find by email

// Real-time listeners
subscribeToUsers(callback)                 // Listen for changes
```

## Technologies Used

- **React 19** - UI framework
- **Firebase v9+** - Backend services
  - Firestore - Real-time database
  - Authentication - User management (ready for integration)
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation

## Modern Firebase Patterns

### Modular SDK
- Using Firebase v9+ modular imports
- Smaller bundle size with tree-shaking
- Better performance

### Real-time Listeners
```javascript
const unsubscribe = onSnapshot(query, (snapshot) => {
  // Data updates in real-time
});

// Cleanup
unsubscribe();
```

### Error Handling
- Try-catch blocks for all async operations
- User-friendly error messages
- Console logging for debugging

### Timestamps
- Using Firestore `Timestamp.now()` for server-side timestamps
- Consistent date formatting across the app

## Production Considerations

### Security
- Implement Firebase Security Rules for data access control
- Set up authentication before deploying
- Validate data server-side

### Performance
- Consider pagination for large datasets
- Implement caching strategies
- Monitor Firestore read/write costs

### Backup & Recovery
- Enable Firestore backups
- Monitor database growth
- Archive old data periodically

## Troubleshooting

### Common Issues

1. **"Your API key is invalid"**
   - Check `.env.local` has correct Firebase credentials
   - Ensure Firestore is enabled in Firebase Console

2. **"Permission denied" errors**
   - Check Firestore Security Rules
   - Ensure collections are created properly

3. **Data not appearing**
   - Verify documents exist in Firestore Console
   - Check real-time listener is subscribed
   - Look for console errors

4. **Slow performance**
   - Check Firestore indexes
   - Reduce number of real-time listeners
   - Implement pagination

## Next Steps

1. ✅ Install Firebase and configure credentials
2. ✅ Create Firestore collections
3. ✅ Test CRUD operations
4. ⬜ Implement Firebase Authentication
5. ⬜ Add user authentication UI
6. ⬜ Set up Firestore Security Rules
7. ⬜ Deploy to production (Firebase Hosting)

## Support

For Firebase issues: https://firebase.google.com/docs
For Firestore queries: https://firebase.google.com/docs/firestore/query-data/queries
For Security Rules: https://firebase.google.com/docs/firestore/security/start
