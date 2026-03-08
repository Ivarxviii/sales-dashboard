type InsightsSectionProps = {
  insights: string[]
}

export default function InsightsSection({ insights }: InsightsSectionProps) {
  const isEmpty = insights.length === 0

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Insights
      </h3>
      {isEmpty ? (
        <p className="text-sm text-gray-500">No insights available.</p>
      ) : (
        <ul className="space-y-2">
          {insights.map((insight, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
              {insight}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
