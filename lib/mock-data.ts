export const kpis = [
  { title: "Total Revenue", value: "$24,580.00", change: "+12%" },
  { title: "Orders", value: "418", change: "+8%" },
  { title: "Average Order Value", value: "$58.80", change: "+3%" },
  { title: "Unique Customers", value: "127", change: "+5%" },
  { title: "Revenue per Customer", value: "$193.54", change: "+7%" },
  { title: "Returning Customers", value: "27%", change: "+1.5%" },
]

export const revenueByMonth = [
  { month: "Jan", revenue: 18200 },
  { month: "Feb", revenue: 22100 },
  { month: "Mar", revenue: 19800 },
  { month: "Apr", revenue: 24580 },
]

export const topProducts = [
  { name: "Premium Plan", units: 156, revenue: 7800 },
  { name: "Starter Kit", units: 342, revenue: 5130 },
  { name: "Pro Add-on", units: 89, revenue: 4450 },
  { name: "Enterprise License", units: 12, revenue: 3600 },
  { name: "Basic Subscription", units: 421, revenue: 2105 },
]

export const topCustomers = [
  { name: "ScaleUp Ltd", revenue: 12450 },
  { name: "Acme Corp", revenue: 8950 },
  { name: "Design Co", revenue: 7200 },
  { name: "TechStart Inc", revenue: 4130 },
  { name: "BuildRight LLC", revenue: 2850 },
]

export const recentOrders = [
  { id: "#10284", date: "2025-03-07", customer: "Acme Corp", amount: 299, status: "Paid" },
  { id: "#10283", date: "2025-03-07", customer: "TechStart Inc", amount: 149, status: "Paid" },
  { id: "#10282", date: "2025-03-06", customer: "Design Co", amount: 599, status: "Paid" },
  { id: "#10281", date: "2025-03-06", customer: "BuildRight LLC", amount: 89, status: "Pending" },
  { id: "#10280", date: "2025-03-05", customer: "ScaleUp Ltd", amount: 999, status: "Paid" },
]

export function getSampleCsvContent(): string {
  return `order_id,date,customer,product,quantity,amount,status
#10284,2025-03-07,Acme Corp,Premium Plan,2,299,Paid
#10284,2025-03-07,Acme Corp,Add-on,1,50,Paid
#10283,2025-03-07,TechStart Inc,Starter Kit,1,149,Paid
#10282,2025-03-06,Design Co,Pro Add-on,1,599,Paid
#10281,2025-03-06,BuildRight LLC,Basic Subscription,1,89,Pending
#10280,2025-03-05,ScaleUp Ltd,Enterprise License,1,999,Paid`
}
