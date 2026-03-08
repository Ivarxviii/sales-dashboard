import React from "react"
type KpiCardProps = {
  title: string
  value: string
  change: string
}

export default function KpiCard({ title, value, change }: KpiCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="mt-2 text-2xl font-bold">{value}</h2>
      <p className="mt-1 text-sm text-green-600">{change} vs last month</p>
    </div>
  )
}
