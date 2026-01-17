# Quick Reference: Mock Data Structure

## 📍 Where Mock Data Lives

```
Dashboard.jsx    → mockProjects, mockTasks
Projects.jsx     → mockProjects
Tasks.jsx        → mockTasks, mockProjects, mockUsers
Users.jsx        → mockUsers, mockTasks
```

## 🎯 Mock Data Overview

### Users (4 entries)
```javascript
usr_001 → Maria Rodriguez (frontend-developer, Engineering)
usr_002 → James Chen (backend-developer, Engineering)
usr_003 → Sofia Martinez (qa-engineer, QA)
usr_004 → Alex Johnson (devops-engineer, Infrastructure)
```

### Projects (3 entries)
```javascript
prj_001 → Website Redesign (in-progress, Jan 5 - Feb 28)
prj_002 → Mobile App Development (active, Nov 1 - Jun 30)
prj_003 → Database Migration (completed, Sep 1 - Dec 20)
```

### Tasks (5 entries)
```javascript
tsk_001 → Design Homepage Layout (high, in-progress, prj_001, usr_001)
tsk_002 → Setup Development Environment (high, pending, prj_002, usr_002)
tsk_003 → Write Unit Tests (medium, completed, prj_001, usr_003)
tsk_004 → Database Schema Design (high, in-progress, prj_002, usr_004)
tsk_005 → API Documentation (medium, pending, prj_001, usr_001)
```

## 🔗 Data Relationships

### Task Assignments
- Maria Rodriguez: tsk_001, tsk_005 (2 tasks)
- James Chen: tsk_002 (1 task)
- Sofia Martinez: tsk_003 (1 task)
- Alex Johnson: tsk_004 (1 task)

### Project Tasks
- Website Redesign: tsk_001, tsk_003, tsk_005 (3 tasks)
- Mobile App: tsk_002, tsk_004 (2 tasks)
- Database Migration: (0 tasks)

## 💾 CRUD Operations

### Create
```javascript
const newItem = {
  id: `type_${Date.now()}`,
  ...formData,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
setData([...data, newItem]);
```

### Read
```javascript
const item = data.find(item => item.id === id);
const filtered = data.filter(item => item.status === 'completed');
```

### Update
```javascript
setData(data.map(item =>
  item.id === id 
    ? { ...item, ...updates, updatedAt: new Date().toISOString() }
    : item
));
```

### Delete
```javascript
setData(data.filter(item => item.id !== id));
```

## 🛠️ Helper Functions

### Dashboard
```javascript
// Count completed tasks
tasks.filter(t => t.status === 'completed').length

// Count pending tasks
tasks.filter(t => t.status === 'pending').length

// Count overdue tasks
tasks.filter(t => {
  if (t.status === 'completed') return false;
  return new Date(t.deadline) < new Date();
}).length
```

### Tasks Component
```javascript
// Get project name
const getProjectName = (projectId) => {
  const project = projects.find(p => p.id === projectId);
  return project ? project.name : 'N/A';
};

// Get user name
const getUserName = (userId) => {
  const user = users.find(u => u.id === userId);
  return user ? user.name : 'Unassigned';
};

// Check if overdue
const isOverdue = (task) => {
  if (task.status === 'completed') return false;
  return new Date(task.deadline) < new Date();
};
```

### Users Component
```javascript
// Get task count for user
const getTaskCount = (userId) => {
  return mockTasks.filter(t => t.assignedTo === userId).length;
};
```

## 🎨 Status & Priority Values

### Task Status
- `pending` - Not started
- `in-progress` - Currently being worked on
- `completed` - Done

### Task Priority
- `low` - Can wait
- `medium` - Normal priority
- `high` - Urgent

### Project Status
- `active` - Currently running
- `in-progress` - In development
- `completed` - Finished

## 📅 Date Formats

All dates use **ISO 8601** format:
```
YYYY-MM-DD           (dates: "2026-01-25")
YYYY-MM-DDTHH:MM:SSZ (timestamps: "2026-01-15T09:30:00Z")
```

## 🔍 Sample Data Access

### Get all tasks for a project
```javascript
const projectTasks = mockTasks.filter(t => t.projectId === 'prj_001');
// Returns: [tsk_001, tsk_003, tsk_005]
```

### Get all tasks assigned to a user
```javascript
const userTasks = mockTasks.filter(t => t.assignedTo === 'usr_001');
// Returns: [tsk_001, tsk_005]
```

### Get completed tasks
```javascript
const completed = mockTasks.filter(t => t.status === 'completed');
// Returns: [tsk_003]
```

### Get overdue tasks
```javascript
const overdue = mockTasks.filter(t => {
  return t.status !== 'completed' && 
         new Date(t.deadline) < new Date();
});
```

## ✅ Validation Rules

### User Role
Must be one of:
- `frontend-developer`
- `backend-developer`
- `qa-engineer`
- `devops-engineer`

### Task Status
Must be one of:
- `pending`
- `in-progress`
- `completed`

### Task Priority
Must be one of:
- `low`
- `medium`
- `high`

### Date Format
Must be valid:
- Date input: YYYY-MM-DD
- Timestamps: ISO 8601 string

## 🚀 Running the App

```bash
# Development
npm run dev
# → http://localhost:5173/

# Production build
npm run build
# → Output in dist/

# The app works fully offline with no backend needed!
```

## 📝 Notes

- All data is in-memory (resets on page refresh)
- No data persistence
- All IDs are unique strings
- Timestamps auto-generate on create/update
- Relationships maintained via ID matching
- No validation errors - accept all input
