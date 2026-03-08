import { formatCurrency } from "@/lib/csv-transform"

type TopCustomersProps = {
  topCustomers: { name: string; revenue: number }[]
}

export default function TopCustomers({ topCustomers }: TopCustomersProps) {
  const isEmpty = topCustomers.length === 0

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Top Customers
      </h3>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
          <p className="text-sm text-gray-500">No customer data</p>
          <p className="mt-1 text-xs text-gray-400">
            Upload a CSV with customer and amount columns
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full min-w-[280px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-3 pt-1 font-semibold">Customer</th>
                <th className="pb-3 pt-1 font-semibold text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topCustomers.map((customer) => (
                <tr key={customer.name} className="hover:bg-gray-50/50">
                  <td className="py-3 font-medium text-gray-900">{customer.name}</td>
                  <td className="py-3 text-right font-medium text-gray-900">
                    {formatCurrency(customer.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
