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

const data = [
  { day: 'Mon', value: 20 },
  { day: 'Tue', value: 30 },
  { day: 'Wed', value: 25 },
  { day: 'Thu', value: 40 },
  { day: 'Fri', value: 35 },
  { day: 'Sat', value: 28 },
  { day: 'Sun', value: 32 },
]

const barData = [
  { name: 'Row #2', value: 95 },
  { name: 'Row #3', value: 85 },
  { name: 'Row #4', value: 78 },
  { name: 'Row #5', value: 65 },
  { name: 'Row #6', value: 50 },
]

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
      </div>
    </div>
  )
}
