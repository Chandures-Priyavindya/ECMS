import { useState } from 'react';
import { Pencil, Trash } from 'lucide-react';
import DashboardSidebar from '../Layouts/Dashboardsidebar';
import Header from "../Layouts/Header";

interface Machine {
  name: string;
  status: 'Active' | 'Maintenance' | 'Inactive' | 'Warning';
  location: string;
}

const statusColor = {
  Active: 'text-green-600',
  Maintenance: 'text-blue-600',
  Inactive: 'text-gray-600',
  Warning: 'text-red-600',
};

const machinesData: Machine[] = [
  { name: 'Compressor C-102', status: 'Active', location: 'Building A, Floor 2' },
  { name: 'Assembly Line B', status: 'Maintenance', location: 'Building B, Floor 1' },
  { name: 'HVAC System', status: 'Inactive', location: 'Building A, Floor 2' },
  { name: 'Packaging Unit P1', status: 'Active', location: 'Building B, Floor 1' },
  { name: 'Conveyor Belt A', status: 'Active', location: 'Building A, Floor 2' },
  { name: 'Industrial Oven O-3', status: 'Active', location: 'Building B, Floor 1' },
  { name: 'Cooling System CS-2', status: 'Warning', location: 'Building A, Floor 2' },
];

const MachineManagement = () => {
  const [machines] = useState<Machine[]>(machinesData);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMachines = machines.filter(machine =>
    machine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden p-4 space-y-4">
              <Header
                title="Machine Management"
                subtitle="Centralized control and monitoring of all machines"
              />
      
          <div className="flex justify-end">
          <button
            className="bg-[#091053] hover:bg-[#1424B9] text-white px-6 py-2 rounded-lg font-medium"
          >
            Add Machine
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
              {filteredMachines.map((machine, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">{machine.name}</td>
                  <td className={`px-4 py-3 font-medium ${statusColor[machine.status]}`}>
                    {machine.status}
                  </td>
                  <td className="px-4 py-3">{machine.location}</td>
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
    </div>
  );
};

export default MachineManagement;
