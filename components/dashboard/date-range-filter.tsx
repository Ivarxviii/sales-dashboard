"use client"

import { useState } from "react"

const ranges = ["Last 7 days", "Last 30 days", "Last 90 days"] as const

export default function DateRangeFilter() {
  const [selected, setSelected] = useState("Last 30 days")

  return (
    <div className="flex gap-2">
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => setSelected(range)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            selected === range
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
