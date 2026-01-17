# Firebase Integration Quick Reference

## All Files Converted to Firebase ✅

### File Status Summary
| Component | Status | Collection(s) | CRUD Operations |
|-----------|--------|---------------|-----------------|
| Dashboard.jsx | ✅ Complete | projects, tasks | READ |
| Projects.jsx | ✅ Complete | projects | CREATE, READ, UPDATE, DELETE |
| Tasks.jsx | ✅ Complete | tasks, projects, taskManagement | CREATE, READ, UPDATE, DELETE |
| Users.jsx | ✅ Complete | taskManagement | CREATE, READ, UPDATE, DELETE |

## Key Changes Made

### Imports (All Files)
```javascript
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
```

### Collection References

**Dashboard.jsx**
```javascript
const projectsRef = collection(db, 'projects');
const tasksRef = collection(db, 'tasks');
```

**Projects.jsx**
```javascript
const projectsRef = collection(db, 'projects');
```

**Tasks.jsx**
```javascript
const tasksRef = collection(db, 'tasks');
const projectsRef = collection(db, 'projects');
const usersRef = collection(db, 'taskManagement');
```

**Users.jsx**
```javascript
const usersRef = collection(db, 'taskManagement');
```

## CRUD Pattern Examples

### Dashboard - READ ONLY
```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const projectsSnapshot = await getDocs(projectsRef);
      const tasksSnapshot = await getDocs(tasksRef);

      setProjects(
        projectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );

      setTasks(
        tasksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

### Projects - FULL CRUD

**CREATE**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const docRef = await addDoc(projectsRef, {
      ...formData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setProjects((prev) => [...prev, { id: docRef.id, ...formData }]);
    closeModal();
  } catch (err) {
    setError('Failed to save project');
  }
};
```

**READ**
```javascript
useEffect(() => {
  const fetchProjects = async () => {
    try {
      const snapshot = await getDocs(projectsRef);
      setProjects(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (err) {
      setError('Failed to load projects');
    }
  };
  fetchProjects();
}, []);
```

**UPDATE**
```javascript
await updateDoc(doc(db, 'projects', editingProject.id), {
  ...formData,
  updatedAt: serverTimestamp(),
});

setProjects((prev) =>
  prev.map((p) =>
    p.id === editingProject.id ? { ...p, ...formData } : p
  )
);
```

**DELETE**
```javascript
const handleDelete = async (id) => {
  if (!confirm('Are you sure?')) return;
  try {
    await deleteDoc(doc(db, 'projects', id));
    setProjects((prev) => prev.filter((p) => p.id !== id));
  } catch (err) {
    setError('Failed to delete project');
  }
};
```

## State Management

### Each component uses:
```javascript
const [data, setData] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingItem, setEditingItem] = useState(null);
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState(null);
const [formData, setFormData] = useState({/* form fields */});
```

## Helper Functions

### Projects.jsx
- `getProjectStats()` - Returns project count and status breakdown

### Tasks.jsx
- `getProjectName(projectId)` - Looks up project name by ID
- `getUserName(userId)` - Looks up user name by ID  
- `isOverdue(task)` - Checks if task deadline has passed

### Users.jsx
- `getTaskCount(userId)` - Counts tasks assigned to user

## Error Handling Pattern

All operations use try-catch:
```javascript
try {
  // Firebase operation
} catch (err) {
  console.error(err);
  setError('User-friendly error message');
} finally {
  setSubmitting(false);
}
```

## Modal Pattern

All components use controlled modal:
```javascript
const closeModal = () => {
  setIsModalOpen(false);
  setEditingItem(null);
  setFormData({ /* reset form */ });
  setError(null);
};
```

## Form Submission Pattern

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setError(null);

  try {
    if (editingItem) {
      // UPDATE
      await updateDoc(doc(db, 'collection', id), {
        ...formData,
        updatedAt: serverTimestamp(),
      });
      // Update local state
    } else {
      // CREATE
      const docRef = await addDoc(ref, {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      // Update local state with new document
    }
    closeModal();
  } catch (err) {
    setError('Failed to save');
  } finally {
    setSubmitting(false);
  }
};
```

## Testing Guide

### Test Checklist
- [ ] Components render without errors
- [ ] Data loads from Firebase on mount
- [ ] Create operations add documents to Firestore
- [ ] Update operations modify existing documents
- [ ] Delete operations remove documents from Firestore
- [ ] Error messages display for failed operations
- [ ] Modal forms work correctly
- [ ] Form validation prevents empty submissions
- [ ] Loading states display during operations
- [ ] Overdue tasks show correct indicators
- [ ] Dropdown menus populate with correct data

## Common Issues & Solutions

### Issue: Data not loading
**Check**: 
- Firebase config is correct
- Collections exist in Firestore
- User has read permissions

### Issue: Create/Update failing
**Check**:
- User has write permissions
- Form data is complete and valid
- serverTimestamp() is being used correctly

### Issue: IDs not matching
**Check**:
- Using `doc.id` when fetching (not `id` from data)
- References match between collections (projectId, assignedTo, etc.)

## Firebase Security Best Practices

1. **Validate all data** before saving to Firestore
2. **Use proper error handling** for all async operations
3. **Implement Firestore security rules** for production
4. **Monitor read/write usage** to optimize costs
5. **Add rate limiting** for public applications

## Performance Optimization Tips

1. **Pagination**: Add limit() and startAfter() for large datasets
2. **Filtering**: Use where() clauses instead of client-side filtering
3. **Real-time listeners**: Consider onSnapshot() instead of getDocs() for live data
4. **Indexes**: Create composite indexes for complex queries
5. **Caching**: Implement client-side caching strategy

---
**Last Updated**: January 2025
**Firebase SDK**: v9+ (Modular)
**React Version**: 18+
