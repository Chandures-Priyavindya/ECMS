import { useState, useEffect } from 'react';
import { Pencil, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import DashboardSidebar from '../Layouts/Dashboardsidebar';

interface Machine {
  _id: string;
  machineName: string;
  status: 'Active' | 'Maintenance' | 'Inactive' | 'Warning';
  location: string;
}

const statusColor = {
  Active: 'text-green-600',
  Maintenance: 'text-blue-600',
  Inactive: 'text-gray-600',
  Warning: 'text-red-600',
};

const MachineManagement = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Manage modal visibility
  const [machineToDelete, setMachineToDelete] = useState<Machine | null>(null); // Store the machine to be deleted
  const navigate = useNavigate();

  // Fetch machine data from backend when the component mounts
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/machines');
        setMachines(response.data); // Set fetched data to state
      } catch (error) {
        console.error('Error fetching machines:', error);
      }
    };

    fetchMachines();
  }, []);

  const filteredMachines = machines.filter(machine =>
    machine.machineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to open delete confirmation modal
  const openDeleteModal = (machine: Machine) => {
    setMachineToDelete(machine); // Set the machine to be deleted
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to close delete confirmation modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false); // Close the modal
    setMachineToDelete(null); // Reset the machine to delete
  };

  // Handle machine deletion
  const handleDelete = async () => {
    if (machineToDelete) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/machines/${machineToDelete._id}`);
        if (response.status === 200) {
          // Remove the deleted machine from the state
          setMachines(machines.filter((machine) => machine._id !== machineToDelete._id));
          closeDeleteModal(); // Close the modal after successful deletion
        }
      } catch (error) {
        console.error('Error deleting machine:', error);
      }
    }
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Machine Management</h1>
          <button
            onClick={() => navigate('/add-machine')}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded shadow text-sm"
          >
            + Add Machine
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search Machines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="px-4 py-3">Machine Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMachines.map((machine) => (
                <tr key={machine._id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">{machine.machineName}</td>
                  <td className={`px-4 py-3 font-medium ${statusColor[machine.status]}`}>
                    {machine.status}
                  </td>
                  <td className="px-4 py-3">{machine.location}</td>
                  <td className="px-4 py-3 flex space-x-3">
                    <button className="text-green-600 hover:text-green-800">
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(machine)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredMachines.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No machines found.
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
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this machine?</h2>
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

export default MachineManagement;
