type TopProductsProps = {
  topProducts: { name: string; units: number; revenue: number }[]
}

export default function TopProducts({ topProducts }: TopProductsProps) {
  const isEmpty = topProducts.length === 0

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Top Products
      </h3>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
          <p className="text-sm text-gray-500">No product data</p>
          <p className="mt-1 text-xs text-gray-400">Upload a CSV with product and quantity columns</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full min-w-[280px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-3 pt-1 font-semibold">Product</th>
                <th className="pb-3 pt-1 font-semibold text-right">Units</th>
                <th className="pb-3 pt-1 font-semibold text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topProducts.map((product) => (
                <tr key={product.name} className="hover:bg-gray-50/50">
                  <td className="py-3 font-medium text-gray-900">{product.name}</td>
                  <td className="py-3 text-right text-gray-600">{product.units}</td>
                  <td className="py-3 text-right font-medium text-gray-900">${product.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
