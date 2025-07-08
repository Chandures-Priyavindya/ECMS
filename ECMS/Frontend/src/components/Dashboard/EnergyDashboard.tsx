import { useEffect, useState } from "react";
import axios from "axios";
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

type EnergyDataItem = { name: string; kWh: number };

type AlertItem = {
  severity: string;
  alertType: string;
  machine: string;
  status: string;
  time: string;
};

type TopConsumer = {
  name: string;
  usage: number;
};

type Summary = {
  totalConsumption: number;
  totalConsumptionChange: string;
  highestConsumer: string;
  highestConsumerChange: string;
  energyEfficiency: number;
  energyEfficiencyChange: string;
  topConsumers: TopConsumer[];
  activeAlertCount: number;
};

export default function EnergyDashboard() {
  const [energyData, setEnergyData] = useState<EnergyDataItem[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalConsumption: 0,
    totalConsumptionChange: "",
    highestConsumer: "",
    highestConsumerChange: "",
    energyEfficiency: 0,
    energyEfficiencyChange: "",
    topConsumers: [],
    activeAlertCount: 0,
  });
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<null | string>(null);
  const [viewMode, setViewMode] = useState("7d");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [trendRes, topConsumersRes, alertsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/energy/trend?range=${viewMode}`),
        axios.get("http://localhost:5000/api/energy/top-consumers"),
        axios.get("http://localhost:5000/api/alerts/latest"),
      ]);

      const trendData: EnergyDataItem[] = trendRes.data;
      const topConsumers: TopConsumer[] = topConsumersRes.data || [];
      const latestAlerts: AlertItem[] = alertsRes.data?.alerts || [];
      const activeAlertCount = alertsRes.data?.activeCount || 0;

      const totalUsage = topConsumers.reduce((acc, curr) => acc + (curr.usage || 0), 0);
      const highestConsumer = topConsumers.length > 0 ? topConsumers[0].name : "N/A";

      setEnergyData(trendData);

      setSummary((prev) => ({
        ...prev,
        totalConsumption: totalUsage,
        totalConsumptionChange: "+5.2% from last month",
        highestConsumer: highestConsumer,
        highestConsumerChange: "+12% this week",
        energyEfficiency: 87,
        energyEfficiencyChange: "+2.3% improved",
        topConsumers: topConsumers,
        activeAlertCount: activeAlertCount,
      }));

      setAlerts(latestAlerts);
    } catch (err) {
      console.error("Dashboard fetch error", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [viewMode]);

  const handleExport = () => {
    // Prepare the data for the printable report
    const reportContent = `
      <div style="font-family: Arial, sans-serif; margin: 20px; background-color: #F9F9F9; color: #333;">
        <h1 style="color: #1F6FEB; text-align: center;">Energy Dashboard Report</h1>
        
        <div style="background-color: #FFF; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
          <h2 style="color: #1F6FEB; font-size: 20px;">Summary</h2>
          <p><strong>Total Energy Consumption: </strong><span style="color: #1F6FEB; font-size: 24px;">${summary.totalConsumption} kWh</span></p>
          <p><strong>Highest Consumer: </strong><span style="color: #FF6347; font-size: 20px;">${summary.highestConsumer}</span></p>
          <p><strong>Energy Efficiency: </strong><span style="color: #28A745; font-size: 20px;">${summary.energyEfficiency}%</span></p>
          <p><strong>Active Alerts: </strong><span style="color: #FF6347; font-size: 20px;">${summary.activeAlertCount}</span></p>
        </div>
        
        <div style="background-color: #FFF; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
          <h3 style="color: #FFB820;">Energy Consumption Trend</h3>
          <div>
            ${energyData.map(item => `
              <p style="font-size: 18px; color: #555;">${item.name}: <span style="color: #1F6FEB;">${item.kWh} kWh</span></p>
            `).join('')}
          </div>
        </div>

        <div style="background-color: #FFF; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
          <h3 style="color: #FFB820;">Top Energy Consumers</h3>
          <div>
            ${summary.topConsumers.map((consumer) => `
              <p style="font-size: 18px; color: #555;">${consumer.name}: <span style="color: #1F6FEB;">${consumer.usage} kWh</span></p>
            `).join('')}
          </div>
        </div>
        
        <div style="background-color: #FFF; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
          <h3 style="color: #FF6347;">Active Alerts</h3>
          <div>
            ${alerts.length > 0 ? alerts.map((alert) => `
              <div style="border: 1px solid #FF6347; padding: 10px; margin-bottom: 10px; border-radius: 5px; background-color: #FFEBEB;">
                <p><strong style="color: #FF6347;">${alert.alertType}</strong> in <span style="color: #555;">${alert.machine}</span></p>
                <p style="font-size: 14px; color: #777;">Status: ${alert.status} • Time: ${alert.time} • Severity: <span style="color: #FF6347;">${alert.severity}</span></p>
              </div>
            `).join('') : `<p>No active alerts</p>`}
          </div>
        </div>
      </div>
    `;

    // Open the print window
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow?.document.write(reportContent);
    printWindow?.document.close();
    printWindow?.print();
  };

  const maxUsage =
    summary.topConsumers.length > 0
      ? Math.max(...summary.topConsumers.map((c) => c.usage))
      : 1;

  return (
    <div className="flex w-screen h-screen bg-gray-50 overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Energy Dashboard</h1>
            <p className="text-gray-500">Monitor and analyze your energy consumption in real-time</p>
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <SummaryCard title="Total Energy Consumption (MTD)" value={`${summary.totalConsumption} kWh`} change={summary.totalConsumptionChange} color="text-blue-600" />
          <SummaryCard title="Highest Consumer" value={summary.highestConsumer} change={summary.highestConsumerChange} color="text-red-500" />
          <SummaryCard title="Energy Efficiency" value={`${summary.energyEfficiency}%`} change={summary.energyEfficiencyChange} color="text-green-500" />
          <SummaryCard title="Active Alerts" value={`${summary.activeAlertCount}`} color="text-red-500" />
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-4 flex-1 min-h-0">
          <div className="flex justify-between mb-2">
            <h2 className="font-semibold">Energy Consumption Trend</h2>
            <div className="space-x-2">
              <button
                onClick={() => setViewMode("7d")}
                className={`px-4 py-1 rounded text-sm font-medium ${viewMode === "7d" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                7 Days
              </button>
              <button
                onClick={() => setViewMode("30d")}
                className={`px-4 py-1 rounded text-sm font-medium ${viewMode === "30d" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                30 Days
              </button>
            </div>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="kWh" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="flex gap-4 w-full min-h-0 overflow-hidden">
          <div className="flex-1 bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-2">Top Energy Consumers</h2>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="flex justify-around items-end h-44">
                {summary.topConsumers.map((consumer, index) => {
                  const usage = consumer.usage;
                  const barHeight = Math.max((usage / maxUsage) * 120, 20);
                  return (
                    <div key={index} className="flex flex-col items-center w-1/6">
                      <div className="text-xs font-medium mb-1">{usage} kWh</div>
                      <div
                        className="bg-yellow-400 w-full rounded-t hover:bg-yellow-500 transition-colors"
                        style={{ height: `${barHeight}px`, transition: "height 0.3s ease" }}
                      ></div>
                      <div className="text-xs mt-2 font-medium text-center">{consumer.name}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex-1 bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-2">Active Alerts</h2>
            {loading ? (
              <LoadingSpinner />
            ) : alerts.length === 0 ? (
              <p className="text-gray-400">No active alerts</p>
            ) : (
              <div className="flex flex-col space-y-2 overflow-y-auto max-h-60">
                {alerts.map((alert, index) => {
                  let badgeColor = "bg-yellow-100 text-yellow-700";
                  if (alert.severity === "High") badgeColor = "bg-red-100 text-red-700";
                  else if (alert.severity === "Medium") badgeColor = "bg-orange-100 text-orange-700";

                  return (
                    <div key={index} className={`p-3 rounded-lg flex flex-col ${badgeColor}`}>
                      <div className="flex items-center gap-2 text-sm">
                        <span>🔔</span>
                        <strong>{alert.alertType}</strong> in <strong>{alert.machine}</strong>
                      </div>
                      <div className="text-xs mt-1">
                        Status: {alert.status} • {alert.time}
                      </div>
                      <div className="text-xs font-semibold uppercase">Severity: {alert.severity}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  change,
  color,
}: {
  title: string;
  value: string;
  change?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {change && <div className="text-xs text-gray-400">{change}</div>}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-32">
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
