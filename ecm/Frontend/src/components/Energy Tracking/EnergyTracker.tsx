"use client"

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
]

const topConsumers = [
  { name: "HVAC System", consumption: 280 },
  { name: "Assembly Line A", consumption: 240 },
  { name: "Compressor B", consumption: 200 },
  { name: "Water Pump", consumption: 160 },
  { name: "Lighting", consumption: 120 },
]

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
      </div>
    </div>
  </CardContent>
</Card>




        {/* Chart Section */}
        {chartType === "bar" ? (
          /* Top Energy Consumers Bar Chart */
          <Card className="bg-gradient-to-br from-[#091053] to-[#1424B9] text-white">
            <CardHeader>
              <CardTitle className="text-white text-xl font-semibold">Top Energy Consumers</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topConsumers} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "white", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis tick={{ fill: "white", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                  <Bar dataKey="consumption" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ) : (
          /* Energy Consumption Trend Line Chart */
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Energy Consumption Trend</CardTitle>
              <p className="text-sm text-gray-600">Monitor your energy usage over time</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={energyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={{ stroke: "#e5e7eb" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="consumption"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#06b6d4" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Energy Consumption Insights */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Energy Consumption Insights</CardTitle>
          </CardHeader>
          <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                {/* Total Energy Consumption (MTD) */}
                <div className="p-4 bg-white rounded-[15px] shadow-[0_4px_4px_rgba(0,140,255,0.25)]">
                  <div className="text-sm text-gray-600 mb-1 text-center">Total Energy Consumption (MTD)</div>
                  <div className="text-2xl font-bold text-blue-600 text-center">3,428 kWh</div>
                  <div className="text-xs text-gray-500 text-center">+4% from last month</div>
                </div>

                {/* Highest Consumer */}
                <div className="p-4 bg-white rounded-[15px] shadow-[0_4px_4px_rgba(255,0,4,0.25)]">
                  <div className="text-sm text-gray-600 mb-1 text-center">Highest Consumer</div>
                  <div className="text-2xl font-bold text-red-500 text-center">CNC Machine</div>
                  <div className="text-xs text-gray-500 text-center">+6% from last week</div>
                </div>

                {/* Energy Efficiency */}
                <div className="p-4 bg-white rounded-[15px] shadow-[0_4px_4px_rgba(0,78,35,0.25)]">
                  <div className="text-sm text-gray-600 mb-1 text-center">Energy Efficiency</div>
                  <div className="text-2xl font-bold text-green-600 text-center">87%</div>
                  <div className="text-xs text-gray-500 text-center">+2% from last month</div>
                </div>

                {/* Active Alerts */}
                <div className="p-4 bg-white rounded-[15px] shadow-[0_4px_4px_rgba(255,0,4,0.25)]">
                  <div className="text-sm text-gray-600 mb-1 text-center">Active Alerts</div>
                  <div className="text-2xl font-bold text-red-500 text-center">3</div>
                  <div className="text-xs text-gray-500 text-center">2 high priority</div>
                </div>
              </div>




          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
