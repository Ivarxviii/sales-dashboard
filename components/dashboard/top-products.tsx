import { topProducts } from "@/lib/mock-data"

export default function TopProducts() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Top Products
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium text-right">Units</th>
              <th className="pb-3 font-medium text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product) => (
              <tr key={product.name} className="border-b border-gray-50">
                <td className="py-3 font-medium">{product.name}</td>
                <td className="py-3 text-right text-gray-600">{product.units}</td>
                <td className="py-3 text-right font-medium">${product.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
