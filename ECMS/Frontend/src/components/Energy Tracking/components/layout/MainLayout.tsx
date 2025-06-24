import type React from "react"
import DashboardSidebar from "../../../Layouts/Dashboardsidebar"
import Header from "./Header"

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
