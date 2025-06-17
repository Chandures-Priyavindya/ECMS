"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import MainLayout from "../components/layout/MainLayout"

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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Energy Tracking</h1>
            <p className="text-gray-600 text-sm">Monitor and analyze energy consumption data</p>
          </div>
          <Button className="bg-[#091053] hover:bg-[#1424B9] text-white px-6 py-2 rounded-lg font-medium">Share</Button>
        </div>

        {/* Filters */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search Machines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={chartType === "bar" ? "default" : "ghost"}
                    onClick={() => setChartType("bar")}
                    className={`flex-1 text-sm font-medium ${
                      chartType === "bar" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Bar Chart
                  </Button>
                  <Button
                    variant={chartType === "line" ? "default" : "ghost"}
                    onClick={() => setChartType("line")}
                    className={`flex-1 text-sm font-medium ${
                      chartType === "line" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Line Chart
                  </Button>
                </div>
              </div>
              <div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
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
              <div>
                <Select value={machineFilter} onValueChange={setMachineFilter}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="All Machine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Machine</SelectItem>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  <div className="w-[232px] h-[116px] text-center p-4 bg-blue-50 rounded-[15px] shadow-[0px_4px_4px_rgba(0,140,255,0.25)]">
    <div className="text-sm text-gray-600 mb-1">Total Energy Consumption (MTD)</div>
    <div className="text-2xl font-bold text-blue-600">3,428 kWh</div>
    <div className="text-xs text-gray-500">+4% from last month</div>
  </div>

  <div className="w-[232px] h-[116px] text-center p-4 bg-red-50 rounded-[15px] shadow-[0px_4px_4px_rgba(255,0,0,0.25)]">
    <div className="text-sm text-gray-600 mb-1">Highest Consumer</div>
    <div className="text-2xl font-bold text-red-500">CNC Machine</div>
    <div className="text-xs text-gray-500">+6% from last week</div>
  </div>

  <div className="w-[232px] h-[116px] text-center p-4 bg-green-50 rounded-[15px] shadow-[0px_4px_4px_rgba(0,128,0,0.25)]">
    <div className="text-sm text-gray-600 mb-1">Energy Efficiency</div>
    <div className="text-2xl font-bold text-green-600">87%</div>
    <div className="text-xs text-gray-500">+2% from last month</div>
  </div>

  <div className="w-[232px] h-[116px] text-center p-4 bg-red-50 rounded-[15px] shadow-[0px_4px_4px_rgba(255,0,0,0.25)]">
    <div className="text-sm text-gray-600 mb-1">Active Alerts</div>
    <div className="text-2xl font-bold text-red-500">3</div>
    <div className="text-xs text-gray-500">2 high priority</div>
  </div>
</div>

          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
