import { useState } from 'react'
import DashboardSidebar from '../../Layouts/Dashboardsidebar'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Search, Share } from 'lucide-react'
import Select from 'react-select'

<<<<<<< HEAD:ECMS/Frontend/src/components/Energy Tracking/EnergyTracker.tsx
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import MainLayout from "../Layouts/MainLayout"
import Header from "../Layouts/Header"


const energyData = [
  { day: "Mon", consumption: 450 },
  { day: "Tue", consumption: 520 },
  { day: "Wed", consumption: 480 },
  { day: "Thu", consumption: 390 },
  { day: "Fri", consumption: 560 },
  { day: "Sat", consumption: 420 },
  { day: "Sun", consumption: 380 },
=======
const data = [
  { day: 'Mon', value: 20 },
  { day: 'Tue', value: 30 },
  { day: 'Wed', value: 25 },
  { day: 'Thu', value: 40 },
  { day: 'Fri', value: 35 },
  { day: 'Sat', value: 28 },
  { day: 'Sun', value: 32 },
>>>>>>> 5a2aed2b93cf178d8e696ab5a9496d9a177f780f:ECMS/Frontend/src/components/Energy Tracking/pages/EnergyTracker.tsx
]

const barData = [
  { name: 'Row #2', value: 95 },
  { name: 'Row #3', value: 85 },
  { name: 'Row #4', value: 78 },
  { name: 'Row #5', value: 65 },
  { name: 'Row #6', value: 50 },
]

<<<<<<< HEAD:ECMS/Frontend/src/components/Energy Tracking/EnergyTracker.tsx
export default function EnergyTracker() {
  const [chartType, setChartType] = useState("bar")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [machineFilter, setMachineFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  
  return (
  <MainLayout>
    <div className="space-y-6">
        <Header
          title = "Energy Tracking"
          subtitle = "Monitor and analyze energy consumption data"
      />
      <div className="flex justify-end">
        <Button className="bg-[#091053] hover:bg-[#1424B9] text-white px-6 py-2 rounded-lg font-medium">Share</Button>
      </div>
<Card className="bg-white shadow-sm p-6">
  <CardHeader className="pb-4">
    <CardTitle className="text-lg font-semibold text-gray-900">Filters</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Search Input */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-semibold text-gray-700">Search</label>
        <Input
          placeholder="Search Machines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[rgba(217,217,217,0.29)] shadow-md rounded-md h-14 px-4 border border-transparent focus:border-gray-300 focus:ring-0"
          style={{ boxShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}
        />
      </div>

      {/* Chart Type Buttons with Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-semibold text-gray-700">Chart Type</label>
        <div className="flex bg-white shadow-md rounded-lg p-1 h-12 space-x-2" style={{ boxShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}>
          <Button
            variant={chartType === "bar" ? "default" : "ghost"}
            onClick={() => setChartType("bar")}
            className={`flex-1 text-sm font-medium rounded-md h-10 ${
              chartType === "bar"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:bg-indigo-100 hover:text-indigo-700"
            }`}
          >
            Bar Chart
          </Button>
          <Button
            variant={chartType === "line" ? "default" : "ghost"}
            onClick={() => setChartType("line")}
            className={`flex-1 text-sm font-medium rounded-md h-10 ${
              chartType === "line"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:bg-indigo-100 hover:text-indigo-700"
            }`}
          >
            Line Chart
          </Button>
        </div>
      </div>

      {/* Severity Filter with Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-semibold text-gray-700">Severity</label>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger
            className="bg-white border border-gray-300 rounded-md h-12 shadow-md"
            style={{ boxShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}
          >
            <SelectValue placeholder="All Severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Machine Filter with Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-semibold text-gray-700">Machine</label>
        <Select value={machineFilter} onValueChange={setMachineFilter}>
          <SelectTrigger
            className="bg-white border border-gray-300 rounded-md h-12 shadow-md"
            style={{ boxShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}
          >
            <SelectValue placeholder="All Machines" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Machines</SelectItem>
            <SelectItem value="hvac">HVAC System</SelectItem>
            <SelectItem value="assembly">Assembly Line</SelectItem>
            <SelectItem value="compressor">Compressor</SelectItem>
          </SelectContent>
        </Select>
=======
type InsightCardProps = {
  title: string
  value: string
  subtitle: string
  color?: string
}

const InsightCard = ({ title, value, subtitle, color = 'text-blue-500' }: InsightCardProps) => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <p className="text-gray-600 text-sm">{title}</p>
    <p className={`text-2xl font-semibold ${color} mt-1`}>{value}</p>
    <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
  </div>
)

export const EnergyTracker = ({ dataId }: { dataId?: string }) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')

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
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
              <Share size={16} />
              Share
            </button>
          </div>

          {/* Updated Filters Row */}
          <div className="flex flex-wrap gap-6 mb-6 items-end">
            <div className="flex flex-col">
              <h2 className="text-lg font-medium mb-2">Filters</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search Machines..."
                  className="w-64 pl-10 pr-4 py-1 border rounded-md"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-medium mb-2">Chart Type</p>
              <div className="flex gap-2">
                <button
                  className={`px-4 py-1 rounded-md ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                  onClick={() => setChartType('bar')}
                >
                  Bar Chart
                </button>
                <button
                  className={`px-4 py-1 rounded-md ${chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                  onClick={() => setChartType('line')}
                >
                  Line Chart
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-medium mb-2">Alert Severity</p>
              <Select
                className="w-48"
                options={[{ value: 'all', label: 'All Severities' }]}
                defaultValue={{ value: 'all', label: 'All Severities' }}
              />
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-medium mb-2">Machine</p>
              <Select
                className="w-48"
                options={[{ value: 'all', label: 'All Machine' }]}
                defaultValue={{ value: 'all', label: 'All Machine' }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-medium mb-4">
              {chartType === 'line' ? 'Energy Consumption Trend' : 'Top Energy Consumers'}
            </h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#2563eb" />
                  </LineChart>
                ) : (
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#fbbf24" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InsightCard
              title="Total Energy Consumption (MTD)"
              value="3,428 kWh"
              subtitle="+5% from last month"
            />
            <InsightCard
              title="Highest Consumer"
              value="CNC Machine"
              subtitle="+5% from last month"
              color="text-red-500"
            />
            <InsightCard
              title="Energy Efficiency"
              value="87%"
              subtitle="+5% from last month"
              color="text-green-500"
            />
            <InsightCard
              title="Active Alerts"
              value="3"
              subtitle="All systems normal"
              color="text-orange-500"
            />
          </div>
        </div>
>>>>>>> 5a2aed2b93cf178d8e696ab5a9496d9a177f780f:ECMS/Frontend/src/components/Energy Tracking/pages/EnergyTracker.tsx
      </div>
    </div>
  )
}
