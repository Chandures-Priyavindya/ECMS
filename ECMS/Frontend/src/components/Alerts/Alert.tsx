
import React, { useState } from 'react';
import DashboardSidebar from '../Layouts/Dashboardsidebar';
import Header from "../Layouts/Header";

interface AlertItem {
  severity: 'High' | 'Medium' | 'Low';
  alertType: string;
  machine: string;
  status: string;
  time: string;
}

const alertsData: AlertItem[] = [
  { severity: 'High', alertType: 'Energy Consumption Spike', machine: 'Compressor C-102', status: 'Active', time: '2 hours ago' },
  { severity: 'Medium', alertType: 'Energy Consumption Spike', machine: 'Assembly Line B', status: 'Active', time: '10.31AM' },
  { severity: 'Low', alertType: 'Energy Consumption Spike', machine: 'HVAC System', status: 'Active', time: 'Yesterday' },
  { severity: 'High', alertType: 'Energy Consumption Spike', machine: 'Packaging Unit P1', status: 'Active', time: 'Yesterday' },
  { severity: 'Medium', alertType: 'Energy Consumption Spike', machine: 'Conveyor Belt A', status: 'Active', time: 'Yesterday' },
  { severity: 'Low', alertType: 'Energy Consumption Spike', machine: 'Industrial Oven O-3', status: 'Active', time: 'Yesterday' },
  { severity: 'High', alertType: 'Energy Consumption Spike', machine: 'Cooling System CS-2', status: 'Active', time: 'Yesterday' },
];

const severityColors: { [key: string]: string } = {
  High: 'text-red-600',
  Medium: 'text-yellow-500',
  Low: 'text-green-600',
};

const Alert: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All Severities');
  const [selectedMachine, setSelectedMachine] = useState('All Machines');

  const machinesList = Array.from(new Set(alertsData.map(item => item.machine))).sort();

  const filteredData = alertsData.filter(item => {
    const matchesSearch = item.machine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'All Severities' || item.severity === selectedSeverity;
    const matchesMachine = selectedMachine === 'All Machines' || item.machine === selectedMachine;
    return matchesSearch && matchesSeverity && matchesMachine;
  });

  return (
    <div className="flex w-full bg-gray-50 overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden p-4 space-y-4">
        <Header
          title="Alerts"
          subtitle="Filter, review, and respond to machine alerts efficiently"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Search Machine</label>
            <input
              type="text"
              placeholder="Search Machines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Alert Severity</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Severities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Machine</label>
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Machines</option>
              {machinesList.map((machine) => (
                <option key={machine}>{machine}</option>
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
                  <td className={`px-4 py-3 font-semibold ${severityColors[item.severity]}`}>
                    {item.severity}
                  </td>
                  <td className="px-4 py-3">{item.alertType}</td>
                  <td className="px-4 py-3">{item.machine}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">{item.status}</td>
                  <td className="px-4 py-3 text-gray-500">{item.time}</td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No alerts found.
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

export default Alert;
