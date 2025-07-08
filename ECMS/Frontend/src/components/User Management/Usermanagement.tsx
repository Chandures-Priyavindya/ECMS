import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../Layouts/Dashboardsidebar';
import { Pencil, Trash } from 'lucide-react';

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  createdAt?: string; // optional if you store it
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null); // Store the user to delete
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDeleteModal = (user: User) => {
    setUserToDelete(user); // Set the user to be deleted
    setIsDeleteModalOpen(true); // Open the modal
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false); // Close the modal
    setUserToDelete(null); // Reset the user to delete
  };

  const handleDelete = async () => {
    if (userToDelete) {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${userToDelete._id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          // Remove the user from the local state to reflect the change
          setUsers(users.filter((user) => user._id !== userToDelete._id));
          closeDeleteModal(); // Close the modal after successful deletion
        } else {
          console.error('Error deleting user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="flex">
      <DashboardSidebar />

      <div className="flex-1 p-4 sm:p-8 bg-gray-100 min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
          <button
            onClick={() => navigate('/add-user')}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded shadow text-sm"
          >
            + Add User
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search Users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{user.fullName}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">{user.department}</td>
                  <td className="px-4 py-3">{user.createdAt?.slice(0, 10) || '-'}</td>
                  <td className="px-4 py-3 flex space-x-3">
                    <button className="text-green-600 hover:text-green-800">
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(user)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this user?</h2>
            <p className="mb-4">This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
