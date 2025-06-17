"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/Button"
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
  const [chartType, setChartType] = useState("line")
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
            <p className="text-gray-600">Monitor and analyze energy consumption data</p>
          </div>
          <Button className="bg-blue-900 hover:bg-blue-800">Share</Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search Machines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={chartType === "bar" ? "default" : "outline"}
                  onClick={() => setChartType("bar")}
                  className={`flex-1 ${chartType === "bar" ? "bg-blue-500 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  Bar Chart
                </Button>
                <Button
                  variant={chartType === "line" ? "default" : "outline"}
                  onClick={() => setChartType("line")}
                  className={`flex-1 ${chartType === "line" ? "bg-blue-500 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  Line Chart
                </Button>
              </div>
              <div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alert Severity" />
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
                  <SelectTrigger>
                    <SelectValue placeholder="Machine" />
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

        {/* Energy Consumption Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Energy Consumption Trend</CardTitle>
            <p className="text-sm text-gray-600">Monitor your energy usage over time</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              {chartType === "line" ? (
                <LineChart data={energyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="consumption"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6" }}
                  />
                </LineChart>
              ) : (
                <BarChart data={energyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="consumption" fill="#3b82f6" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Energy Consumers and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Energy Consumers */}
          {chartType === "bar" && (
            <Card className="bg-blue-900 text-white">
              <CardHeader>
                <CardTitle className="text-white">Top Energy Consumers</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topConsumers}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "white", fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fill: "white" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Bar dataKey="consumption" fill="#fbbf24" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Energy Consumption Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">3,428 kWh</div>
                  <div className="text-sm text-gray-600">Total Energy Consumption (MTD)</div>
                  <div className="text-xs text-gray-500">+4% from last month</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-500">CNC Machine</div>
                  <div className="text-sm text-gray-600">Highest Consumer</div>
                  <div className="text-xs text-gray-500">+6% from last week</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">87%</div>
                  <div className="text-sm text-gray-600">Energy Efficiency</div>
                  <div className="text-xs text-gray-500">+2% from last month</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-500">3</div>
                  <div className="text-sm text-gray-600">Active Alerts</div>
                  <div className="text-xs text-gray-500">2 high priority</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
