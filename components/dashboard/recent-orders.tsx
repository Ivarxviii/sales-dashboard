type RecentOrdersProps = {
  recentOrders: { id: string; date: string; customer: string; amount: number; status: string }[]
}

export default function RecentOrders({ recentOrders }: RecentOrdersProps) {
  const isEmpty = recentOrders.length === 0

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Recent Orders
      </h3>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
          <p className="text-sm text-gray-500">No order data</p>
          <p className="mt-1 text-xs text-gray-400">Upload a CSV with order_id, date, and amount columns</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full min-w-[400px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-3 pt-1 font-semibold">Order</th>
                <th className="pb-3 pt-1 font-semibold">Date</th>
                <th className="pb-3 pt-1 font-semibold">Customer</th>
                <th className="pb-3 pt-1 font-semibold text-right">Amount</th>
                <th className="pb-3 pt-1 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="py-3 font-medium text-gray-900">{order.id}</td>
                  <td className="py-3 text-gray-600">{order.date}</td>
                  <td className="py-3 text-gray-600">{order.customer}</td>
                  <td className="py-3 text-right font-medium text-gray-900">${order.amount}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${
                        order.status === "Paid"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {order.status}
                    </span>
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
