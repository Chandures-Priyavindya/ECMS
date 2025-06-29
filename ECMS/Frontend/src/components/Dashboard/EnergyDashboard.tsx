import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import DashboardSidebar from "../Layouts/Dashboardsidebar";
import Header from "../Layouts/Header";

const mockEnergyData = [
  { name: "Mon, Jan 1", kWh: 120 },
  { name: "Tue, Jan 2", kWh: 135 },
  { name: "Wed, Jan 3", kWh: 125 },
  { name: "Thu, Jan 4", kWh: 148 },
  { name: "Fri, Jan 5", kWh: 0 },
  { name: "Sat, Jan 6", kWh: 110 },
  { name: "Sun, Jan 7", kWh: 95 },
];

const mockAlerts = [
  { message: "High energy consumption detected in Building A" },
  { message: "Machine M-001 requires maintenance" },
  { message: "Power factor low in Zone 3" },
];

const mockSummary = {
  totalConsumption: 2450,
  totalConsumptionChange: "+5.2% from last month",
  highestConsumer: "Building A",
  highestConsumerChange: "+12% this week",
  energyEfficiency: 87,
  energyEfficiencyChange: "+2.3% improved",
  topConsumers: [
    { name: "Building A", usage: 450 },
    { name: "Building B", usage: 380 },
    { name: "Building C", usage: 320 },
    { name: "Building D", usage: 280 },
    { name: "Building E", usage: 220 },
  ],
};

type EnergyDataItem = { name: string; kWh: number };

export default function EnergyDashboard() {
  const [energyData, setEnergyData] = useState<EnergyDataItem[]>([]);
  const [summary, setSummary] = useState<typeof mockSummary>(mockSummary);
  const [alerts, setAlerts] = useState<{ message: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [viewMode, setViewMode] = useState("7d");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEnergyData(mockEnergyData);
      setSummary(mockSummary);
      setAlerts(mockAlerts);
    } catch (err) {
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [viewMode]);

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Day,Energy Consumption (kWh)", ...energyData.map((item) => `${item.name},${item.kWh}`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "energy_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayedData = viewMode === "7d" ? energyData.slice(-7) : energyData;
  const maxUsage = summary.topConsumers?.length ? Math.max(...summary.topConsumers.map((c) => c.usage)) : 1;

  return (
    <div className="flex w-full bg-gray-50 overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden p-4 space-y-4">
        <Header
          title="Energy Dashboard"
          subtitle="Monitor and analyze your energy consumption in real-time"
        />

        {/* Export Button */}
        <div className="flex justify-end">
          <button
            onClick={handleExport}
            className="bg-[#091053] hover:bg-[#1424B9] text-white px-6 py-2 rounded-lg font-medium"
          >
            Export Report
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-4 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Total Energy Consumption (MTD)</div>
            <div className="text-2xl font-bold text-blue-600">
              {loading ? "Loading..." : `${summary.totalConsumption} kWh`}
            </div>
            <div className="text-xs text-gray-400">{loading ? "" : summary.totalConsumptionChange}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Highest Consumer</div>
            <div className="text-2xl font-bold text-red-500">
              {loading ? "Loading..." : summary.highestConsumer}
            </div>
            <div className="text-xs text-gray-400">{loading ? "" : summary.highestConsumerChange}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Energy Efficiency</div>
            <div className="text-2xl font-bold text-green-500">
              {loading ? "Loading..." : `${summary.energyEfficiency}%`}
            </div>
            <div className="text-xs text-gray-400">{loading ? "" : summary.energyEfficiencyChange}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Active Alerts</div>
            <div className="text-2xl font-bold text-red-500">
              {loading ? "Loading..." : alerts.length}
            </div>
          </div>
        </div>

        {/* Energy Chart */}
        <div className="flex flex-col bg-white rounded-lg shadow p-4 flex-1 min-h-[300px]">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Energy Consumption Trend</h2>
            <div className="flex gap-2">
              {["7d", "30d"].map((mode) => (
                <button
                  key={mode}
                  className={`px-4 py-1 rounded text-sm font-medium ${
                    viewMode === mode
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                  onClick={() => setViewMode(mode)}
                >
                  {mode === "7d" ? "7 Days" : "30 Days"}
                </button>
              ))}
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
              <LineChart data={displayedData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis
                  dataKey="name"
                  tickFormatter={(value) => value.split(",")[0]}
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis domain={[0, "dataMax + 20"]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="kWh" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        {/* Bottom Section */}
        <div className="flex flex-1 gap-4 min-h-0 w-full overflow-hidden">
          {/* Top Energy Consumers */}
          <div className="flex flex-col flex-1 bg-white rounded-lg shadow p-4 min-h-0 overflow-hidden">
            <h2 className="font-semibold mb-2">Top Energy Consumers</h2>
            {loading ? (
              <div className="text-gray-500 flex-1 flex justify-center items-center">Loading...</div>
            ) : summary.topConsumers && summary.topConsumers.length > 0 ? (
              <div className="flex justify-around items-end flex-1 px-2" style={{ height: 180 }}>
                {summary.topConsumers.map((consumer, index) => {
                  const usage = Number(consumer.usage) || 0;
                  const max = maxUsage || 1;
                  const maxBarHeight = 120;
                  const barHeight = Math.max((usage / max) * maxBarHeight, 20);

                  return (
                    <div key={index} className="flex flex-col items-center" style={{width: '16%'}}>
                      <div className="text-xs font-medium mb-1">{usage} kWh</div>
                      <div
                        className="bg-yellow-400 w-full rounded-t hover:bg-yellow-500 transition-colors"
                        style={{
                          height: `${barHeight}px`,
                          minWidth: "20px",
                          transition: "height 0.3s ease",
                        }}
                        title={`${consumer.name}: ${usage} kWh`}
                      ></div>
                      <div className="text-xs mt-2 text-center font-medium">{consumer.name}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-400">No top consumers data</div>
            )}
          </div>

          {/* Active Alerts */}
          <div className="flex flex-col flex-1 bg-white rounded-lg shadow p-4 min-h-0 overflow-hidden">
            <h2 className="font-semibold mb-2">Active Alerts</h2>
            {loading ? (
              <div className="text-gray-500 flex-1 flex justify-center items-center">Loading...</div>
            ) : alerts.length === 0 ? (
              <div className="text-gray-400">No active alerts</div>
            ) : (
              <div className="flex flex-col flex-1 space-y-2 overflow-hidden">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="bg-red-100 text-red-600 p-3 rounded-lg flex items-center space-x-2"
                  >
                    <span>🔔</span> 
                    <span className="text-sm">{alert.message}</span>
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



       