"use client"

const ranges = ["Last 7 days", "Last 30 days", "Last 90 days"] as const

export type DateRange = (typeof ranges)[number]

type DateRangeFilterProps = {
  value: DateRange
  onChange: (value: DateRange) => void
}

export default function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {

  return (
    <div className="flex flex-wrap gap-2">
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={`rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
            value === range
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  )
}
