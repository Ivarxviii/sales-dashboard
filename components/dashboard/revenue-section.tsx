type RevenueSectionProps = {
  revenueByMonth: { month: string; revenue: number }[]
}

export default function RevenueSection({ revenueByMonth }: RevenueSectionProps) {
  const isEmpty = revenueByMonth.length === 0
  const maxRevenue = !isEmpty ? Math.max(...revenueByMonth.map((m) => m.revenue)) : 1

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        Revenue
      </h3>
      {isEmpty ? (
        <div className="mt-6 flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-center">
          <p className="text-sm text-gray-500">No revenue data</p>
          <p className="mt-1 text-xs text-gray-400">Upload a CSV with date and amount columns</p>
        </div>
      ) : (
        <div className="mt-4 flex items-end gap-2 sm:gap-4 min-h-[8rem]">
          {revenueByMonth.map(({ month, revenue }) => (
            <div key={month} className="flex-1 flex flex-col items-center gap-2 min-w-0">
              <div
                className="w-full bg-gray-800 rounded-t min-h-[4px] max-h-24 flex-shrink-0"
                style={{ height: `${(revenue / maxRevenue) * 96}px` }}
              />
              <span className="text-xs text-gray-500 truncate w-full text-center">{month}</span>
              <span className="text-xs font-medium">${(revenue / 1000).toFixed(1)}k</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
