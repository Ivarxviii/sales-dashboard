import { revenueByMonth } from "@/lib/mock-data"

export default function RevenueSection() {
  const maxRevenue = Math.max(...revenueByMonth.map((m) => m.revenue))

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        Revenue
      </h3>
      <div className="mt-4 flex items-end gap-4 h-32">
        {revenueByMonth.map(({ month, revenue }) => (
          <div key={month} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-gray-800 rounded-t min-h-[4px] max-h-24"
              style={{ height: `${(revenue / maxRevenue) * 96}px` }}
            />
            <span className="text-xs text-gray-500">{month}</span>
            <span className="text-xs font-medium">${(revenue / 1000).toFixed(1)}k</span>
          </div>
        ))}
      </div>
    </div>
  )
}
