import React, { useEffect, useState } from 'react';
import DashboardSidebar from '../Layouts/Dashboardsidebar';
import axios from 'axios';

interface AlertItem {
  severity: 'High' | 'Medium' | 'Low';
  alertType: string;
  machine: string;
  status: string;
  time: string;
}

const severityColors: { [key: string]: string } = {
  High: 'text-red-600',
  Medium: 'text-yellow-500',
  Low: 'text-green-600',
};

const Alert: React.FC = () => {
  const [alertsData, setAlertsData] = useState<AlertItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All Severities');
  const [selectedMachine, setSelectedMachine] = useState('All Machine');

  useEffect(() => {
    axios.get('http://localhost:5000/api/alerts')
      .then((res) => setAlertsData(res.data))
      .catch((err) => console.error(err));
  }, []);

  const machinesList = Array.from(new Set(alertsData.map(item => item.machine)));

  const filteredData = alertsData.filter(item => {
    const matchesSearch = item.machine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'All Severities' || item.severity === selectedSeverity;
    const matchesMachine = selectedMachine === 'All Machine' || item.machine === selectedMachine;
    return matchesSearch && matchesSeverity && matchesMachine;
  });

  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-1 p-4 sm:p-8 bg-gray-100 min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <h1 className="text-2xl font-semibold text-gray-800">Alerts</h1>

        </div>

        <div className="flex flex-wrap gap-4 mb-6 items-end">
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1">Search Machine</label>
            <input
              type="text"
              placeholder="Enter machine name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-56 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1">Severity</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-44 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Severities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1">Machine</label>
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="w-52 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Machine</option>
              {machinesList.map((machine, idx) => (
                <option key={idx}>{machine}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Severity</th>
                <th className="px-4 py-3 text-left">Alert Type</th>
                <th className="px-4 py-3 text-left">Machine</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
                  <td className={`px-4 py-3 font-semibold ${severityColors[item.severity]}`}>{item.severity}</td>
                  <td className="px-4 py-3">{item.alertType}</td>
                  <td className="px-4 py-3">{item.machine}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">{item.status}</td>
                  <td className="px-4 py-3 text-gray-500">{item.time}</td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">No alerts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Alert;