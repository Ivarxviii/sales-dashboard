"use client"

import { useState, useEffect } from "react"
import KpiCard from "@/components/dashboard/kpi-card"
import DateRangeFilter from "@/components/dashboard/date-range-filter"
import RevenueSection from "@/components/dashboard/revenue-section"
import TopProducts from "@/components/dashboard/top-products"
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
  const isSampleData = getStoredSalesData() === null

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isSampleData && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span className="font-medium">Using sample data.</span>{" "}
          <a href="/upload" className="underline hover:no-underline">
            Upload your own CSV
          </a>
          {" "}to see your sales analytics.
        </div>
      )}
      {!isSampleData && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <span className="font-medium">Showing your uploaded data.</span>
        </div>
      )}
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Overview</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <DateRangeFilter />
          <button
            onClick={handleReset}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 sm:w-auto"
          >
            Reset to sample data
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
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
      </div>

      <RecentOrders recentOrders={salesData.recentOrders} />
    </main>
  )
}
