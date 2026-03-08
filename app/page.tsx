import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
      <p className="text-gray-600">View your sales analytics and upload data</p>
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Login
        </Link>
      </div>
    </main>
  )
}
