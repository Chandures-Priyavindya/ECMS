import { useState, useEffect } from 'react';
import DashboardSidebar from '../../Layouts/Dashboardsidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Share } from 'lucide-react';
import Select from 'react-select';
import axios from 'axios';

// Define the interface for machine data fetched from MongoDB
interface Machine {
  machineName: string;
  status: string;
  location: string;
  kWh: number;
}

const EnergyTracker = ({ dataId }: { dataId?: string }) => {
  const [selectedMachine, setSelectedMachine] = useState<string | null>('All Machines');
  const [searchTerm, setSearchTerm] = useState('');
  const [machineData, setMachineData] = useState<Machine[]>([]);

  // State to store summary values from MongoDB
  const [totalConsumption, setTotalConsumption] = useState<number>(0);
  const [activeAlerts, setActiveAlerts] = useState<number>(0);
  const [highestConsumer, setHighestConsumer] = useState<string>(''); 
  const [highestConsumerKWh, setHighestConsumerKWh] = useState<number>(0); 

  // Fetch data from the backend for machines and energy summary
  useEffect(() => {
    // Fetch machine data
    axios
      .get('/api/machines')
      .then((response) => {
        setMachineData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching machine data: ', error);
      });

    // Fetch energy summary (Total Consumption and Active Alerts)
    axios
      .get('/api/energy-summary')
      .then((response) => {
        setTotalConsumption(response.data.totalConsumption); 
        setActiveAlerts(response.data.activeAlerts);
      })
      .catch((error) => {
        console.error('Error fetching energy summary: ', error);
      });
  }, []);

  // Function to handle machine selection
  const handleMachineSelect = (selectedOption: any) => { 
    setSelectedMachine(selectedOption ? selectedOption.value : 'All Machines');
  };

  // Filter data based on the selected machine and search term
  const filteredData =
    selectedMachine === 'All Machines'
      ? machineData.filter((machine) => machine.machineName.toLowerCase().includes(searchTerm.toLowerCase()))
      : machineData.filter(
          (machine) => machine.machineName === selectedMachine && machine.machineName.toLowerCase().includes(searchTerm.toLowerCase())
        );

  // Calculate the highest consumer after filtering the data
  useEffect(() => {
    if (filteredData.length > 0) {
      // Find the machine with the highest kWh
      const maxMachine = filteredData.reduce((prev, current) => (prev.kWh > current.kWh ? prev : current));
      setHighestConsumer(maxMachine.machineName);
      setHighestConsumerKWh(maxMachine.kWh);
    }
  }, [filteredData]);

  // Web Share API: Share data
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Energy Dashboard Report',
        text: `Energy Consumption Data: Total Consumption - ${totalConsumption} kWh, Highest Consumer - ${highestConsumer}`,
        url: window.location.href, // Share the current page URL
      })
      .then(() => console.log('Shared successfully!'))
      .catch((error) => console.log('Error sharing:', error));
    } else {
      console.log("Web Share API not supported");
    }
  };

  return (
    <div className="flex w-screen h-screen bg-gray-50 overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 p-6 overflow-auto" data-id={dataId}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Energy Tracking</h1>
              <p className="text-sm text-gray-500">Monitor and analyze energy consumption data</p>
            </div>
            <button
              onClick={handleShare}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Share size={16} />
              Share
            </button>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-6 mb-6 items-end">
            <div className="flex flex-col">
              <h2 className="text-lg font-medium mb-2">Filters</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search Machines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-1 border rounded-md"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-medium mb-2">Machine</p>
              <Select
                className="w-48"
                options={[{ value: 'All Machines', label: 'All Machines' }, ...machineData.map((machine) => ({
                  value: machine.machineName,
                  label: machine.machineName,
                }))]}
                onChange={handleMachineSelect}
                value={selectedMachine ? { value: selectedMachine, label: selectedMachine } : { value: 'All Machines', label: 'All Machines' }}
                placeholder="Select Machine"
              />
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-medium mb-4">
              {selectedMachine && selectedMachine !== 'All Machines'
                ? `${selectedMachine} Energy Consumption`
                : 'Top Energy Consumers'}
            </h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="machineName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="kWh" fill="#fbbf24" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights (Total Consumption and Alerts from MongoDB) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-600 text-sm">Total Energy Consumption </p>
              <p className="text-2xl font-semibold text-blue-500 mt-1">{totalConsumption} kWh</p>
              <p className="text-gray-400 text-xs mt-1">Total Machines Energy Consumption</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-600 text-sm">Highest Consumer</p>
              <p className="text-2xl font-semibold text-red-500 mt-1">{highestConsumer}</p>
              <p className="text-gray-400 text-xs mt-1">kWh: {highestConsumerKWh}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-600 text-sm">Energy Efficiency</p>
              <p className="text-2xl font-semibold text-green-500 mt-1">87%</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-600 text-sm">Active Alerts</p>
              <p className="text-2xl font-semibold text-orange-500 mt-1">{activeAlerts}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { EnergyTracker }; // Export the component
