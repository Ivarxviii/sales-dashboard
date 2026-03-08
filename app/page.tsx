import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="text-base font-semibold text-gray-900 sm:text-lg">
            Sales Dashboard
          </span>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/upload" className="text-sm text-gray-600 hover:text-gray-900">
              Upload
            </Link>
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          B2B sales analytics, simplified
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-600">
          Upload your sales CSV and instantly see revenue trends, top products, and recent orders.
          No setup, no backend—just your data in a clean dashboard.
        </p>

        <ul className="mt-8 space-y-3 text-gray-600">
          <li className="flex items-start gap-3">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900" />
            <span>Upload a CSV with order data</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900" />
            <span>View KPIs, revenue charts, and product performance</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900" />
            <span>Works entirely in the browser—your data stays local</span>
          </li>
        </ul>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            View Dashboard
          </Link>
          <Link
            href="/upload"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-white"
          >
            Upload CSV
          </Link>
        </div>
      </section>
    </main>
  )
}
