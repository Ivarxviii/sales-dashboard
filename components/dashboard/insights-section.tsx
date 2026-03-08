type Insight = { text: string; help?: string }

type InsightsSectionProps = {
  insights: Insight[]
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
        <ul className="space-y-3">
          {insights.map((insight, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
              <span className="flex-1 min-w-0">{insight.text}</span>
              {insight.help && (
                <span
                  title={insight.help}
                  className="shrink-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-xs cursor-help"
                  aria-label="More info"
                >
                  ?
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
