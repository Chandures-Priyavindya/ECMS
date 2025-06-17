"use client"
import { Link, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"
import { LayoutDashboard, Settings, Zap, Users, AlertTriangle, Activity, Cpu } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Machines", href: "/machines", icon: Cpu },
  { name: "Energy Tracker", href: "/energy-tracker", icon: Zap },
  { name: "AI Clustering", href: "/ai-clustering", icon: Activity },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "User Management", href: "/user-management", icon: Users },
]

const settings = [{ name: "Settings", href: "/settings", icon: Settings }]

export default function Sidebar() {
  const location = useLocation()

  return (
    <div className="flex h-screen w-64 flex-col bg-gradient-to-b from-[#091053] via-[#1424B9] to-[#091053] text-white">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-2">
          <Zap className="h-8 w-8 text-yellow-400" />
          <span className="text-xl font-bold">EnergyTrack</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-blue-200 uppercase tracking-wider">Navigation</p>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive ? "bg-blue-700 text-white" : "text-blue-100 hover:text-blue-300",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="pt-8 space-y-1">
          <p className="px-3 text-xs font-semibold text-blue-200 uppercase tracking-wider">Settings</p>
          {settings.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive ? "bg-blue-700 text-white" : "text-blue-100 hover:text-blue-300",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
