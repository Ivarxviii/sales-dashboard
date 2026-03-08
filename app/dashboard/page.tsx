"use client"

import { useState, useEffect } from "react"
import KpiCard from "@/components/dashboard/kpi-card"
import DateRangeFilter from "@/components/dashboard/date-range-filter"
import RevenueSection from "@/components/dashboard/revenue-section"
import TopProducts from "@/components/dashboard/top-products"
import TopCustomers from "@/components/dashboard/top-customers"
import RecentOrders from "@/components/dashboard/recent-orders"
import {
  getStoredSalesData,
  getDefaultData,
  clearStoredSalesData,
  type SalesData,
} from "@/lib/csv-transform"

export default function DashboardPage() {
  const [data, setData] = useState<SalesData | null>(null)

  useEffect(() => {
    const stored = getStoredSalesData()
    setData(stored ?? getDefaultData())
  }, [])

  function handleReset() {
    clearStoredSalesData()
    setData(getDefaultData())
  }

  const salesData = data ?? getDefaultData()

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <div className="flex items-center gap-4">
          <DateRangeFilter />
          <button
            onClick={handleReset}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Reset to sample data
          </button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
        {salesData.kpis.map((kpi) => (
          <KpiCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <RevenueSection revenueByMonth={salesData.revenueByMonth} />
        <TopProducts topProducts={salesData.topProducts} />
        <div className="lg:col-span-2">
          <TopCustomers topCustomers={salesData.topCustomers} />
        </div>
      </div>

      <RecentOrders recentOrders={salesData.recentOrders} />
    </main>
  )
}
