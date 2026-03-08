import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-4">
            <Link href="/dashboard" className="shrink-0 text-base font-semibold text-gray-900 sm:text-lg">
              Sales Dashboard
            </Link>
            <nav className="flex shrink-0 gap-4 sm:gap-6">
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
        </div>
      </header>
      {children}
    </div>
  )
}
