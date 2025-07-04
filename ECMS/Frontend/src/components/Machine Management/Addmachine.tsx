import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import DashboardSidebar from '../Layouts/Dashboardsidebar'; // Import the sidebar

const AddMachine: React.FC = () => {
  const [machineName, setMachineName] = useState('');
  const [status, setStatus] = useState('Active');
  const [location, setLocation] = useState('Building A, Floor 2');
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [modalType, setModalType] = useState<'success' | 'error'>('success'); // Modal type (success/error)
  const navigate = useNavigate(); // For navigation

  const locations = [
    'Building A, Floor 1', 'Building A, Floor 2', 'Building A, Floor 3', 'Building A, Floor 4',
    'Building B, Floor 1', 'Building B, Floor 2', 'Building B, Floor 3', 'Building B, Floor 4',
    'Building C, Floor 1', 'Building C, Floor 2', 'Building C, Floor 3', 'Building C, Floor 4',
    'Building D, Floor 1', 'Building D, Floor 2', 'Building D, Floor 3', 'Building D, Floor 4',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the data to be sent to the backend
    const data = { machineName, status, location };

    try {
      // Send POST request to the backend
      await axios.post('http://localhost:5000/api/machines', data);

      // Show success message and open modal
      setMessage('Machine inserted successfully ✅');
      setModalType('success');
      setModalVisible(true);

      // Redirect to Machine Management after 2 seconds
      setTimeout(() => {
        navigate('/machines');
      }, 2000);
    } catch (error) {
      // Show error message and open modal
      setMessage('Error inserting machine ❌');
      setModalType('error');
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 sm:p-8 bg-gray-100 min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Add New Machine</h1>
        </div>

        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
          {/* Left Column (Form) */}
          <div className="flex-1 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="machineName" className="text-sm font-medium text-gray-700">Machine Name</label>
                <input
                  id="machineName"
                  type="text"
                  value={machineName}
                  onChange={(e) => setMachineName(e.target.value)}
                  placeholder="Enter Machine Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium text-gray-700">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Warning">Warning</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium text-gray-700">Location</label>
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {locations.map((loc, index) => (
                    <option key={index} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>

          {/* Right Column (Image) */}
          <div className="w-full lg:w-1/4 flex items-center justify-center">
            <img
              src="/addmachine.jpg"
              alt="User at work"
              className="rounded-2xl w-full h-auto object-cover max-h-[350px]"
            />
          </div>
        </div>

        {/* Bottom Section for Buttons */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            type="button"
            className="py-2 px-4 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
            onClick={() => navigate('/machine-management')} // Navigate to machine management if needed
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            onClick={handleSubmit} // Trigger submit logic when clicked
          >
            Save Machine
          </button>
        </div>
      </div>

      {/* Modal for Success/Error Message */}
      {modalVisible && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className={`text-xl font-semibold ${modalType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </h2>
            <div className="flex justify-center mt-4">
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMachine;
