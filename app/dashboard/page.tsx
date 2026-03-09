"use client"

import { useState, useEffect } from "react"
import KpiCard from "@/components/dashboard/kpi-card"
import DateRangeFilter, { type DateRange } from "@/components/dashboard/date-range-filter"
import RevenueSection from "@/components/dashboard/revenue-section"
import TopProducts from "@/components/dashboard/top-products"
import TopCustomers from "@/components/dashboard/top-customers"
import InsightsSection from "@/components/dashboard/insights-section"
import RecentOrders from "@/components/dashboard/recent-orders"
import { getDefaultData, transformToDashboardData } from "@/lib/csv-transform"
import {
  getDatasetsState,
  getActiveData,
  setActiveDataset,
  deleteDataset,
  type DatasetsState,
  getActiveDataset,
} from "@/lib/datasets"

export default function DashboardPage() {
  const [datasetsState, setDatasetsState] = useState<DatasetsState | null>(null)
  const [statusFilter, setStatusFilter] = useState("")
  const [productFilter, setProductFilter] = useState("")
  const [customerFilter, setCustomerFilter] = useState("")
  const [dateRange, setDateRange] = useState<DateRange>("Last 30 days")

  useEffect(() => {
    setDatasetsState(getDatasetsState())
  }, [])

  function refresh() {
    setDatasetsState(getDatasetsState())
  }

  function resetFilters() {
    setStatusFilter("")
    setProductFilter("")
    setCustomerFilter("")
    setDateRange("Last 30 days")
  }

  function handleSwitch(id: string | null) {
    setActiveDataset(id)
    refresh()
    resetFilters()
  }

  function handleDelete(id: string) {
    deleteDataset(id)
    refresh()
    resetFilters()
  }

  function handleReset() {
    setActiveDataset(null)
    refresh()
    resetFilters()
  }

  const activeData = datasetsState ? getActiveData() : null
  const activeDataset = datasetsState ? getActiveDataset() : null
  const rows = activeDataset?.rows ?? null

  let salesData = activeData ?? getDefaultData()

  if (rows && rows.length > 0) {
    const validDates = rows
      .map((r) => new Date(r.date))
      .filter((d) => !isNaN(d.getTime()))

    let rangedRows = rows

    if (validDates.length > 0) {
      const latestTime = Math.max(...validDates.map((d) => d.getTime()))
      const latestDate = new Date(latestTime)
      const msInDay = 24 * 60 * 60 * 1000
      const days =
        dateRange === "Last 7 days" ? 7 : dateRange === "Last 30 days" ? 30 : 90
      const fromTime = latestTime - (days - 1) * msInDay

      rangedRows = rows.filter((row) => {
        const d = new Date(row.date)
        if (isNaN(d.getTime())) return false
        const t = d.getTime()
        return t >= fromTime && t <= latestTime
      })
    }

    const filteredRows = rangedRows.filter((row) => {
      if (statusFilter && row.status !== statusFilter) return false
      if (productFilter && row.product !== productFilter) return false
      if (customerFilter && row.customer !== customerFilter) return false
      return true
    })

    salesData = transformToDashboardData(filteredRows)
  }

  const statusOptions =
    rows && rows.length > 0
      ? Array.from(new Set(rows.map((r) => r.status).filter(Boolean))).sort()
      : []
  const productOptions =
    rows && rows.length > 0
      ? Array.from(new Set(rows.map((r) => r.product).filter(Boolean))).sort()
      : []
  const customerOptions =
    rows && rows.length > 0
      ? Array.from(new Set(rows.map((r) => r.customer).filter(Boolean))).sort()
      : []

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
          {rows && rows.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
              >
                <option value="">All statuses</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
              >
                <option value="">All products</option>
                {productOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <select
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
              >
                <option value="">All customers</option>
                {customerOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
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
