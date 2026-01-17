# Task Management System - Backend API

## Overview
This is the backend API for the Task Management System, built with Node.js, Express, Firebase Admin SDK, and Swagger/OpenAPI documentation.

## Features
- ✅ Complete CRUD operations for tasks
- ✅ Firebase Firestore integration
- ✅ Swagger/OpenAPI documentation
- ✅ Error handling and validation
- ✅ CORS enabled

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Firebase Configuration
Get your Firebase service account credentials:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Settings → Service Accounts
4. Click "Generate New Private Key"
5. Copy the JSON file contents

### 3. Configure Environment Variables
Create a `.env` file in the backend folder:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key-from-json"
FIREBASE_CLIENT_EMAIL=your-email@appspot.gserviceaccount.com
PORT=5000
```

**Important:** The private key should be in the `.env` as a single line with `\n` for newlines:
```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...\n-----END PRIVATE KEY-----\n"
```

### 4. Run the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

### Access Swagger UI
Visit `http://localhost:5000/api-docs` to view interactive API documentation

### API Endpoints

#### Get All Tasks
```
GET /api/tasks
```

#### Create Task
```
POST /api/tasks
Body: {
  "title": "Task title",
  "description": "Task description",
  "status": "pending|in-progress|completed",
  "priority": "low|medium|high",
  "assignedTo": "userId",
  "dueDate": "2025-12-31T23:59:59Z"
}
```

#### Get Task by ID
```
GET /api/tasks/{id}
```

#### Update Task
```
PUT /api/tasks/{id}
Body: { ...updated fields }
```

#### Delete Task
```
DELETE /api/tasks/{id}
```

## Task Schema

```json
{
  "id": "auto-generated",
  "title": "Task title",
  "description": "Task description",
  "status": "pending|in-progress|completed",
  "priority": "low|medium|high",
  "assignedTo": "user-id or null",
  "dueDate": "ISO datetime or null",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

## Response Format

All responses follow this format:

### Success (200, 201)
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ...data }
}
```

### Error (400, 404, 500)
```json
{
  "success": false,
  "message": "Error description",
  "error": "Error details"
}
```

## Firestore Collection Structure

Collection name: `tasks`

Document structure:
```
tasks/
  {taskId}/
    - title: string
    - description: string
    - status: string
    - priority: string
    - assignedTo: string|null
    - dueDate: timestamp|null
    - createdAt: timestamp
    - updatedAt: timestamp
```

## Troubleshooting

### Firebase Connection Issues
- Verify `.env` variables are correct
- Check Firebase project exists
- Ensure service account has Firestore permissions
- Look at console logs for detailed error messages

### Port Already in Use
Change the PORT in `.env` file

### CORS Errors
CORS is already enabled. If issues persist, check the frontend URL configuration.
