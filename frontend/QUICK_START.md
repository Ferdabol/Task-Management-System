# Quick Start Guide - Firebase Integration

## 🚀 Get Started in 5 Minutes

### Step 1: Set Up Firebase Project (2 min)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project" and create a new project
3. Enable Firestore Database (production mode)
4. Go to Project Settings → General
5. Copy your Web app credentials

### Step 2: Configure Environment (1 min)
1. In the `frontend/` directory, create `.env.local`:
```bash
cp .env.example .env.local
```
2. Replace the placeholders with your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=abc123xyz...
VITE_FIREBASE_AUTH_DOMAIN=myproject.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=myproject
VITE_FIREBASE_STORAGE_BUCKET=myproject.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123...
```

### Step 3: Create Firestore Collections (2 min)
In Firebase Console → Firestore Database:

**Create Collection: `projects`**
- Click "Start collection"
- Collection ID: `projects`
- Skip auto-generated ID
- Add one document manually to verify

**Create Collection: `tasks`**
- Collection ID: `tasks`
- Skip auto-generated ID

**Create Collection: `users`**
- Collection ID: `users`
- Skip auto-generated ID

### Step 4: Start the App
```bash
cd frontend
npm install
npm run dev
```

## 📝 Test the Setup

1. **Create a Project:**
   - Navigate to Projects page
   - Click "New Project"
   - Fill in details and submit
   - Check Firestore Console to verify data

2. **Create a User:**
   - Navigate to Users page
   - Click "New User"
   - Fill in details and submit
   - Data should appear in Firestore

3. **Create a Task:**
   - Navigate to Tasks page
   - Click "New Task"
   - Select a project and user
   - Data should sync to Firestore in real-time

4. **Check Dashboard:**
   - Dashboard should show real-time stats
   - Numbers update when you add data

## 🔧 Firestore Security Rules

For development, use these permissive rules (change before production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all read/write for now (DEVELOPMENT ONLY!)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

For production, secure your data properly in Firebase Console.

## 📚 Project Files Overview

```
frontend/
├── src/
│   ├── config/
│   │   └── firebase.js           ← Firebase initialization
│   ├── services/
│   │   ├── projectService.js     ← Project CRUD
│   │   ├── taskService.js        ← Task CRUD
│   │   └── userService.js        ← User CRUD
│   ├── pages/
│   │   ├── Dashboard.jsx         ← Real-time stats
│   │   ├── Projects.jsx          ← Project management
│   │   ├── Tasks.jsx             ← Task management
│   │   └── Users.jsx             ← User management
│   └── App.jsx                   ← Main app
├── .env.example                  ← Config template
├── FIREBASE_SETUP.md             ← Full setup guide
├── IMPLEMENTATION_CHECKLIST.md   ← Implementation status
└── package.json                  ← Dependencies
```

## ❓ Common Issues & Solutions

### Issue: "Invalid API Key" error
**Solution:** Check `.env.local` has correct Firebase credentials

### Issue: "Permission denied" when saving
**Solution:** Update Firestore Security Rules (see above)

### Issue: No data appearing in Firestore Console
**Solution:** Create collections manually in Firebase Console first

### Issue: "Cannot find module 'firebase'"
**Solution:** Run `npm install firebase`

## 📖 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Queries Guide](https://firebase.google.com/docs/firestore/query-data/queries)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)

## ✨ Key Features

✅ **Real-time Data Sync** - Changes appear instantly across all pages
✅ **Firestore Backend** - All data stored in cloud database
✅ **CRUD Operations** - Create, read, update, delete for projects, tasks, users
✅ **Error Handling** - User-friendly error messages
✅ **Loading States** - Visual feedback while fetching data
✅ **Production Ready** - Modern Firebase v9+ patterns

## 🎯 Next Steps

1. Complete the setup above
2. Test CRUD operations
3. Review [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for advanced configuration
4. Implement Firebase Authentication (optional)
5. Set up proper Security Rules for production
6. Deploy to production

---

**Need help?** See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed troubleshooting.
