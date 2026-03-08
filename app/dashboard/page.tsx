"use client"

import { useState, useEffect } from "react"
import KpiCard from "@/components/dashboard/kpi-card"
import DateRangeFilter from "@/components/dashboard/date-range-filter"
import RevenueSection from "@/components/dashboard/revenue-section"
import TopProducts from "@/components/dashboard/top-products"
import TopCustomers from "@/components/dashboard/top-customers"
import InsightsSection from "@/components/dashboard/insights-section"
import RecentOrders from "@/components/dashboard/recent-orders"
import { getDefaultData } from "@/lib/csv-transform"
import {
  getDatasetsState,
  getActiveData,
  setActiveDataset,
  deleteDataset,
  type DatasetsState,
} from "@/lib/datasets"

export default function DashboardPage() {
  const [datasetsState, setDatasetsState] = useState<DatasetsState | null>(null)

  useEffect(() => {
    setDatasetsState(getDatasetsState())
  }, [])

  function refresh() {
    setDatasetsState(getDatasetsState())
  }

  function handleSwitch(id: string | null) {
    setActiveDataset(id)
    refresh()
  }

  function handleDelete(id: string) {
    deleteDataset(id)
    refresh()
  }

  function handleReset() {
    setActiveDataset(null)
    refresh()
  }

  const activeData = datasetsState ? getActiveData() : null
  const salesData = activeData ?? getDefaultData()

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <div className="flex flex-wrap items-center gap-4">
          {datasetsState && datasetsState.datasets.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="dataset-select" className="sr-only">
                Active dataset
              </label>
              <select
                id="dataset-select"
                value={datasetsState.activeId ?? ""}
                onChange={(e) => handleSwitch(e.target.value || null)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
              >
                <option value="">Sample data</option>
                {datasetsState.datasets.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              {datasetsState.activeId && (
                <button
                  type="button"
                  onClick={() => handleDelete(datasetsState.activeId!)}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              )}
            </div>
          )}
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

      <div className="mb-8">
        <InsightsSection insights={salesData.insights ?? []} />
      </div>

      <RecentOrders recentOrders={salesData.recentOrders} />
    </main>
  )
}
