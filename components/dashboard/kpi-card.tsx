type KpiCardProps = {
  title: string
  value: string
  change: string
}

export default function KpiCard({ title, value, change }: KpiCardProps) {
  const hasComparison = change !== "—"
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
      <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900">{value}</p>
      <p
        className={`mt-2 text-sm ${hasComparison ? "text-green-600" : "text-gray-400"}`}
      >
        {hasComparison ? `${change} vs previous period` : "No comparison available"}
      </p>
    </div>
  )
}
