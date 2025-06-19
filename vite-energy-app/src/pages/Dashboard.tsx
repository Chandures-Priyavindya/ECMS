import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  FaBolt,
  FaCogs,
  FaBell,
  FaUsers,
  FaCog,
  FaRobot,
  FaTachometerAlt,
} from "react-icons/fa";
import { Card, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import axios from "axios";

export default function EnergyDashboard() {
  const [energyData, setEnergyData] = useState([]);
  const [summary, setSummary] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("7d");

  const fetchDashboardData = async (days = 7) => {
    try {
    setLoading(true);
    const response = await axios.get(`/api/dashboard-data?days=${days}`);
    setEnergyData(response.data.energyTrend);
    setSummary(response.data.summary);
    setAlerts(response.data.alerts);
  } catch (err) {
    console.error(err);
    setError("Failed to fetch dashboard data");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {const days = viewMode === "7d" ? 7 : 30;
  fetchDashboardData(days);
  }, [viewMode]);

  function handleExport() {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["Day,Month,Energy Consumption (kWh)", ...energyData.map(item => `${item.name},${item.kWh}`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "energy_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const displayedData = viewMode === "7d" ? energyData.slice(-7) : energyData;

  // Calculate max usage for dynamic top consumers scaling
  const maxUsage = summary.topConsumers ? Math.max(...summary.topConsumers.map(c => Number(c.usage))) : 1;

  return (
    <div className="flex w-screen h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col flex-shrink-0">
        <div className="p-4 font-bold text-xl flex items-center">
          <FaBolt className="mr-2" /> EnergyTrack
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <div className="space-y-2">
            <Link to="/" className="flex items-center text-yellow-400 font-semibold">
              <FaTachometerAlt className="mr-2" /> Dashboard
            </Link>
            <Link to="/machines" className="flex items-center hover:text-yellow-400">
              <FaCogs className="mr-2" /> Machines
            </Link>
            <Link to="/clustering" className="flex items-center hover:text-yellow-400">
              <FaRobot className="mr-2" /> AI Clustering
            </Link>
            <Link to="/tracker" className="flex items-center hover:text-yellow-400">
              <FaBolt className="mr-2" /> Energy Tracker
            </Link>
            <Link to="/alerts" className="flex items-center hover:text-yellow-400">
              <FaBell className="mr-2" /> Alerts
            </Link>
            <Link to="/users" className="flex items-center hover:text-yellow-400">
              <FaUsers className="mr-2" /> User Management
            </Link>
          </div>
          <div className="mt-4 border-t border-white/20 pt-4">
            <Link to="/settings" className="flex items-center hover:text-yellow-400">
              <FaCog className="mr-2" /> Settings
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Energy Dashboard</h1>
            <p className="text-gray-500">Monitor and analyze your energy consumption in real-time</p>
          </div>
          <div className="flex flex-col items-end">
            <Button variant="outline" onClick={handleExport}>Export Report</Button>
            <div className="mt-1 text-sm">Admin User ▾</div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-4 flex-shrink-0">
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Total Energy Consumption (MTD)</div>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? "Loading..." : summary.totalConsumption + " kWh"}
              </div>
              <div className="text-xs text-gray-400">{loading ? "" : summary.totalConsumptionChange}</div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Highest Consumer</div>
              <div className="text-2xl font-bold text-red-500">
                {loading ? "Loading..." : summary.highestConsumer}
              </div>
              <div className="text-xs text-gray-400">{loading ? "" : summary.highestConsumerChange}</div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Energy Efficiency</div>
              <div className="text-2xl font-bold text-green-500">
                {loading ? "Loading..." : summary.energyEfficiency + "%"}
              </div>
              <div className="text-xs text-gray-400">{loading ? "" : summary.energyEfficiencyChange}</div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Active Alerts</div>
              <div className="text-2xl font-bold text-red-500">
                {loading ? "Loading..." : alerts.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Energy Consumption Trend */}
        <div className="flex flex-col bg-white rounded shadow p-4 mb-4 flex-1 min-h-0 w-full overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Energy Consumption Trend</h2>
            <div>
              <Button 
              size="sm"
              className={`px-4 py-1 rounded text-sm font-medium ${
              viewMode === "7d"
              ? "bg-blue-600 text-white": "bg-gray-100 text-black hover:bg-gray-200"
        }`}
        onClick={() => setViewMode("7d")}>7 Days</Button>
            <Button
        size="sm"
        className={`px-4 py-1 rounded text-sm font-medium ${
          viewMode === "30d"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-black hover:bg-gray-200"
        }`}
        onClick={() => setViewMode("30d")}
      >
        30 Days
      </Button>   
              
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center flex-1">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayedData}
              margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="name" 
                tickFormatter={(value) => value.split(",")[0]}
                 tick={{ fontSize: 14, dy: 10 }}
                 interval={0}
                 angle={-30}
                textAnchor="end"/>
                <YAxis domain={[0, 'auto']}
                tickFormatter={(value) => (value === 0 ? "" : value)}
                tick={{ fontSize: 14, dx: -4 ,fill: "#333" }}
                tickMargin={10}
                />
                <Tooltip
                contentStyle={{ fontSize: 14 }}
                labelStyle={{ fontSize: 14 }}
                itemStyle={{ fontSize: 14 }} />
                <Line type="monotone" dataKey="kWh" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-1 gap-4 min-h-0 w-full overflow-hidden">
          {/* Top Energy Consumers */}
          <div className="flex flex-col flex-1 bg-white rounded shadow p-4 min-h-0 overflow-hidden">
            <h2 className="font-semibold mb-2">Top Energy Consumers</h2>
            {loading ? (
              <div className="text-gray-500 flex-1 flex justify-center items-center">Loading...</div>
            ) : (
              <div className="flex justify-around items-end flex-1" style={{ height: 180 }}>
                {summary.topConsumers.map((consumer, index) => {
                  const usage = Number(consumer.usage) || 0;
                  const max = maxUsage || 1;
                  const maxBarHeight = 150;
                  const barHeight = (usage / max) * maxBarHeight;

                  return (
                    <div key={index} className="flex flex-col items-center w-1/6">
                      <div
                        className="bg-yellow-400 w-full rounded-t"
                        style={{
                          height: `${barHeight}px`,
                          minHeight: "20px",
                          minWidth: "10px",
                          transition: "height 0.3s ease",
                        }}
                        title={`${consumer.name}: ${usage} kWh`}
                      ></div>
                      <div className="text-xs mt-1 text-center">{consumer.name}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Alerts */}
          <div className="flex flex-col flex-1 bg-white rounded shadow p-4 min-h-0 overflow-hidden">
            <h2 className="font-semibold mb-2">Active Alerts</h2>
            {loading ? (
              <div className="text-gray-500 flex-1 flex justify-center items-center">Loading...</div>
            ) : alerts.length === 0 ? (
              <div className="text-gray-400">No active alerts</div>
            ) : (
              <div className="flex flex-col space-y-1">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="bg-red-100 text-red-600 p-2 rounded flex items-center space-x-2"
                  >
                    <FaBell /> <span>{alert.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


