import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

// MOCK TASKS (unchanged)
const mockTasks = [
  { assignedTo: "usr_001" },
  { assignedTo: "usr_002" },
  { assignedTo: "usr_001" },
];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "developer",
    department: "",
  });

  const usersRef = collection(db, "taskManagement");

  // FETCH USERS
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(usersRef);
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  // TASK COUNT (mock)
  const getTaskCount = (userId) =>
    mockTasks.filter((t) => t.assignedTo === userId).length;

  // CREATE + UPDATE (FIRESTORE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingUser) {
        await updateDoc(doc(db, "taskManagement", editingUser.id), {
          ...formData,
          updatedAt: serverTimestamp(),
        });

        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id ? { ...u, ...formData } : u
          )
        );
      } else {
        const docRef = await addDoc(usersRef, {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        setUsers((prev) => [
          ...prev,
          { id: docRef.id, ...formData },
        ]);
      }

      closeModal();
    } catch (err) {
      console.error(err);
      setError("Failed to save user");
    } finally {
      setSubmitting(false);
    }
  };

  // EDIT
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    });
    setIsModalOpen(true);
  };

  // DELETE (FIRESTORE)
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteDoc(doc(db, "taskManagement", id));
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete user");
    }
  };

  // CLOSE MODAL
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "developer",
      department: "",
    });
    setError(null);
  };

  return (
    <div className="px-4 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Users</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          New User
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasks</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-gray-700">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">{user.department}</td>
                <td className="px-6 py-4">{getTaskCount(user.id)}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-medium">
                  {editingUser ? "Edit User" : "New User"}
                </h3>

                <input
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <input
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />

                <input
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  required
                />

                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="manager">Manager</option>
                  <option value="qa">QA</option>
                </select>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {submitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
