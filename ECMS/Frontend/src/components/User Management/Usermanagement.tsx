import React, { useState } from 'react';
import DashboardSidebar from '../Layouts/DashboardSidebar';
import { Pencil, Trash } from 'lucide-react';

interface User {
  name: string;
  email: string;
  role: string;
  roleColor: string;
  department: string;
  lastActive: string;
}

const usersData: User[] = [
  { name: 'Jagath Bumara', email: 'jagath@gmail.com', role: 'Administrator', roleColor: 'text-blue-600', department: 'Operations', lastActive: '2 hours ago' },
  { name: 'Numara Vimalawira', email: 'numara@gmail.com', role: 'Maintenance', roleColor: 'text-blue-400', department: 'Operations', lastActive: '5 hours ago' },
  { name: 'Cansi Nirmala', email: 'cansi@gmail.com', role: 'Viewer', roleColor: 'text-red-400', department: 'Facilities', lastActive: '2 hours ago' },
  { name: 'Vada Kimasha', email: 'vada@gmail.com', role: 'Technician', roleColor: 'text-green-600', department: 'Maintenance', lastActive: '6 hours ago' },
  { name: 'Ziamala Birmarla', email: 'ziamala@gmail.com', role: 'Energy Manager', roleColor: 'text-green-500', department: 'Analytics', lastActive: '2 hours ago' },
  { name: 'Sanga Numari', email: 'sanga@gmail.com', role: 'Analyst', roleColor: 'text-green-400', department: 'Management', lastActive: '3 hours ago' },
  { name: 'Saduni Niwansa', email: 'saduni@gmail.com', role: 'Viewer', roleColor: 'text-red-400', department: 'Operations', lastActive: '1 hour ago' },
];

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = usersData.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <DashboardSidebar />

      <div className="flex-1 p-4 sm:p-8 bg-gray-100 min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
          <button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded shadow text-sm">
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
                <th className="px-4 py-3">Last Active</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className={`px-4 py-3 font-semibold ${user.roleColor}`}>{user.role}</td>
                  <td className="px-4 py-3">{user.department}</td>
                  <td className="px-4 py-3">{user.lastActive}</td>
                  <td className="px-4 py-3 flex space-x-3">
                    <button className="text-green-600 hover:text-green-800">
                      <Pencil size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
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
    </div>
  );
};

export default UserManagement;
