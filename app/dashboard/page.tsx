import KpiCard from "@/components/dashboard/kpi-card"
import DateRangeFilter from "@/components/dashboard/date-range-filter"
import RevenueSection from "@/components/dashboard/revenue-section"
import TopProducts from "@/components/dashboard/top-products"
import RecentOrders from "@/components/dashboard/recent-orders"
import { kpis } from "@/lib/mock-data"

export default function DashboardPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <DateRangeFilter />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <RevenueSection />
        <TopProducts />
      </div>

      <RecentOrders />
    </main>
  )
}
