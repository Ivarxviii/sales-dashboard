import type { ColumnMapping } from "@/lib/csv-parse"
import { REQUIRED_FIELDS } from "@/lib/csv-parse"
import {
  kpis as mockKpis,
  revenueByMonth,
  topProducts,
  topCustomers,
  recentOrders,
  insights as mockInsights,
} from "@/lib/mock-data"

export type SalesRow = {
  order_id: string
  date: string
  customer: string
  product: string
  quantity: string
  amount: string
  status: string
}

export function remapRows(
  rows: Record<string, string>[],
  mapping: ColumnMapping
): SalesRow[] {
  return rows.map((row) => {
    const remapped: SalesRow = {
      order_id: "",
      date: "",
      customer: "",
      product: "",
      quantity: "",
      amount: "",
      status: "",
    }

    for (const field of REQUIRED_FIELDS) {
      const csvHeader = mapping[field]
      ;(remapped as Record<string, string>)[field] =
        (csvHeader ? row[csvHeader] : "") ?? ""
    }

    return remapped
  })
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

export function transformToDashboardData(rows: SalesRow[]): {
  kpis: { title: string; value: string; change: string }[]
  revenueByMonth: { month: string; revenue: number }[]
  topProducts: { name: string; units: number; revenue: number }[]
  topCustomers: { name: string; revenue: number }[]
  recentOrders: { id: string; date: string; customer: string; amount: number; status: string }[]
  insights: { text: string; help?: string }[]
} {
  if (rows.length === 0) {
    return {
      kpis: [
        { title: "Total Revenue", value: formatCurrency(0), change: "—" },
        { title: "Orders", value: "0", change: "—" },
        { title: "Average Order Value", value: formatCurrency(0), change: "—" },
        { title: "Unique Customers", value: "0", change: "—" },
        { title: "Revenue per Customer", value: formatCurrency(0), change: "—" },
        { title: "Returning Customers", value: "0%", change: "—" },
      ],
      revenueByMonth: [],
      topProducts: [],
      topCustomers: [],
      recentOrders: [],
      insights: [],
    }
  }

  // Parses amount/quantity from strings like "$149", "3,447 USD", "1,299.50"
  const parseNum = (val: string): number => {
    const cleaned = String(val)
      .replace(/,/g, "")
      .replace(/\s*(USD|EUR|GBP)\s*/gi, "")
      .replace(/[$€£]/g, "")
      .replace(/[^0-9.-]/g, "")
    const n = parseFloat(cleaned)
    return isNaN(n) ? 0 : n
  }

  // Revenue by month
  const monthMap = new Map<string, number>()
  const orderMap = new Map<string, { date: string; customer: string; amount: number; status: string }>()
  const productMap = new Map<string, { units: number; revenue: number }>()
  const customerOrderCount = new Map<string, number>()
  const customerRevenueMap = new Map<string, number>()
  const monthOrderIds = new Map<string, Set<string>>()
  const monthCustomers = new Map<string, Set<string>>()

  for (const row of rows) {
    const dateStr = row.date?.trim()
    const amount = parseNum(row.amount)
    const quantity = parseNum(row.quantity) || 1
    const orderId = row.order_id?.trim()
    const customer = row.customer?.trim()
    const product = row.product?.trim()
    const status = (row.status || "Unknown").trim() || "Unknown"

    if (!dateStr || !orderId) continue

    const date = new Date(dateStr)
    if (isNaN(date.getTime())) continue

    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    const monthLabel = MONTHS[date.getMonth()] || "?"
    monthMap.set(monthKey, (monthMap.get(monthKey) ?? 0) + amount)

    if (!monthOrderIds.has(monthKey)) {
      monthOrderIds.set(monthKey, new Set())
    }
    if (!monthCustomers.has(monthKey)) {
      monthCustomers.set(monthKey, new Set())
    }
    monthOrderIds.get(monthKey)!.add(orderId)
    if (customer) {
      monthCustomers.get(monthKey)!.add(customer)
    }

    const existing = orderMap.get(orderId)
    if (existing) {
      existing.amount += amount
    } else {
      orderMap.set(orderId, { date: dateStr, customer, amount, status })
    }

    if (product) {
      const p = productMap.get(product) ?? { units: 0, revenue: 0 }
      p.units += quantity
      p.revenue += amount
      productMap.set(product, p)
    }

    customerOrderCount.set(customer, (customerOrderCount.get(customer) ?? 0) + 1)
    customerRevenueMap.set(customer, (customerRevenueMap.get(customer) ?? 0) + amount)
  }

  const totalRevenue = Array.from(orderMap.values()).reduce((s, o) => s + o.amount, 0)
  const orderCount = orderMap.size
  const avgOrder = orderCount > 0 ? totalRevenue / orderCount : 0
  const uniqueCustomers = customerOrderCount.size
  const revenuePerCustomer = uniqueCustomers > 0 ? totalRevenue / uniqueCustomers : 0
  const returningCount = Array.from(customerOrderCount.values()).filter((c) => c > 1).length
  const returningPct = uniqueCustomers > 0 ? ((returningCount / uniqueCustomers) * 100).toFixed(1) : "0"

  const monthKeys = Array.from(monthMap.keys()).sort((a, b) => a.localeCompare(b))

  const formatChange = (current: number, previous: number): string => {
    if (!isFinite(previous) || previous <= 0) return "—"
    const diff = ((current - previous) / previous) * 100
    if (!isFinite(diff)) return "—"
    const rounded = Math.round(diff)
    const sign = rounded > 0 ? "+" : ""
    return `${sign}${rounded}%`
  }

  let revenueChange: string = "—"
  let ordersChange: string = "—"
  let customersChange: string = "—"
  let revenuePerCustomerChange: string = "—"

  if (monthKeys.length >= 2) {
    const currentMonthKey = monthKeys[monthKeys.length - 1]!
    const previousMonthKey = monthKeys[monthKeys.length - 2]!

    const currentRevenue = monthMap.get(currentMonthKey) ?? 0
    const previousRevenue = monthMap.get(previousMonthKey) ?? 0

    const currentOrders = monthOrderIds.get(currentMonthKey)?.size ?? 0
    const previousOrders = monthOrderIds.get(previousMonthKey)?.size ?? 0

    const currentCustomers = monthCustomers.get(currentMonthKey)?.size ?? 0
    const previousCustomers = monthCustomers.get(previousMonthKey)?.size ?? 0

    const currentRevenuePerCustomer =
      currentCustomers > 0 ? currentRevenue / currentCustomers : 0
    const previousRevenuePerCustomer =
      previousCustomers > 0 ? previousRevenue / previousCustomers : 0

    revenueChange = formatChange(currentRevenue, previousRevenue)
    ordersChange = formatChange(currentOrders, previousOrders)
    customersChange = formatChange(currentCustomers, previousCustomers)
    revenuePerCustomerChange = formatChange(
      currentRevenuePerCustomer,
      previousRevenuePerCustomer
    )
  }

  const revenueByMonthResult = Array.from(monthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, revenue]) => {
      const [, m] = key.split("-").map(Number)
      return { month: MONTHS[m] ?? "?", revenue }
    })

  const topProductsResult = Array.from(productMap.entries())
    .map(([name, { units, revenue }]) => ({ name, units, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  const topCustomersResult = Array.from(customerRevenueMap.entries())
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  const recentOrdersResult = Array.from(orderMap.entries())
    .map(([id, { date, customer, amount, status }]) => ({ id, date, customer, amount, status }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  const insights = generateInsights({
    totalRevenue,
    revenuePerCustomer,
    revenueByMonthResult,
    topProductsResult,
    topCustomersResult,
  })

  return {
    kpis: [
      { title: "Total Revenue", value: formatCurrency(totalRevenue), change: revenueChange },
      { title: "Orders", value: String(orderCount), change: ordersChange },
      { title: "Average Order Value", value: formatCurrency(avgOrder), change: "—" },
      { title: "Unique Customers", value: String(uniqueCustomers), change: customersChange },
      {
        title: "Revenue per Customer",
        value: formatCurrency(revenuePerCustomer),
        change: revenuePerCustomerChange,
      },
      { title: "Returning Customers", value: `${returningPct}%`, change: "—" },
    ],
    revenueByMonth: revenueByMonthResult.length > 0 ? revenueByMonthResult : revenueByMonth,
    topProducts: topProductsResult.length > 0 ? topProductsResult : topProducts,
    topCustomers: topCustomersResult.length > 0 ? topCustomersResult : topCustomers,
    recentOrders: recentOrdersResult.length > 0 ? recentOrdersResult : recentOrders,
    insights,
  }
}

function generateInsights(data: {
  totalRevenue: number
  revenuePerCustomer: number
  revenueByMonthResult: { month: string; revenue: number }[]
  topProductsResult: { name: string; units: number; revenue: number }[]
  topCustomersResult: { name: string; revenue: number }[]
}): { text: string; help?: string }[] {
  const insights: { text: string; help?: string }[] = []
  const { totalRevenue, revenuePerCustomer, revenueByMonthResult, topProductsResult, topCustomersResult } = data

  if (topCustomersResult.length > 0 && totalRevenue > 0) {
    const top = topCustomersResult[0]
    const pct = Math.round((top.revenue / totalRevenue) * 100)
    insights.push({
      text: `${top.name} generated ${pct}% of total revenue (${formatCurrency(top.revenue)}).`,
      help: "Revenue from this customer divided by total revenue.",
    })
  }

  if (topProductsResult.length > 0) {
    const top = topProductsResult[0]
    insights.push({
      text: `${top.name} generated the most revenue (${formatCurrency(top.revenue)}).`,
      help: "Product with the highest total revenue.",
    })
  }

  if (revenuePerCustomer > 0) {
    insights.push({
      text: `Revenue per customer averages ${formatCurrency(revenuePerCustomer)}.`,
      help: "Total revenue divided by number of unique customers.",
    })
  }

  if (revenueByMonthResult.length > 0) {
    const best = revenueByMonthResult.reduce((a, b) => (b.revenue > a.revenue ? b : a))
    insights.push({
      text: `${best.month} generated the highest revenue (${formatCurrency(best.revenue)}).`,
      help: "Month with the most total revenue.",
    })
  }

  if (topProductsResult.length > 0) {
    const byUnits = topProductsResult.reduce((a, b) => (b.units > a.units ? b : a))
    insights.push({
      text: `${byUnits.name} sold the most units (${byUnits.units}).`,
      help: "Product with the highest quantity sold.",
    })
  }

  return insights
}

export function getDefaultData() {
  return {
    kpis: mockKpis,
    revenueByMonth,
    topProducts,
    topCustomers,
    recentOrders,
    insights: mockInsights,
  }
}

export type SalesData = ReturnType<typeof getDefaultData>
