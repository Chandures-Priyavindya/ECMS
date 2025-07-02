import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../Layouts/Dashboardsidebar';
import Swal from 'sweetalert2';

const AddUser: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const payload = { fullName, email, role, department };

    try {
      const res = await fetch('http://localhost:5000/api/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'User added successfully!',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate('/user-management');
        });

        setFullName('');
        setEmail('');
        setRole('');
        setDepartment('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to add user.',
          text: 'Please try again.',
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error connecting to server.',
        text: 'Check your backend server connection.',
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar />

      <div className="flex-1 p-4 sm:p-8">
        <div className="text-sm text-gray-500 mb-2">
          Dashboard &gt; User Management &gt; <span className="text-gray-700 font-medium">Add User</span>
        </div>

        <h1 className="text-2xl font-semibold mb-6">Add New User</h1>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="role">User Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select role</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Worker">Worker</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">Role determines access level and permissions within the system</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="department">Department</label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select department</option>
                <option value="Production">Production</option>
                <option value="HR">HR</option>
                <option value="IT">IT</option>
              </select>
            </div>
          </div>

          <div className="w-full lg:w-1/4 flex items-center justify-center">
            <img
              src="/adduser.jpg"
              alt="User at work"
              className="rounded-2xl w-full h-auto object-cover max-h-[350px]"
            />
          </div>
        </div>

        <div className="flex justify-center mt-8 gap-4">
          <button
            className="px-6 py-2 border rounded-md border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={() => {
              setFullName('');
              setEmail('');
              setRole('');
              setDepartment('');
            }}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Save User
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
