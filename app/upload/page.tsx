import Link from "next/link"

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <Link href="/dashboard" className="text-lg font-semibold text-gray-900">
              Sales Dashboard
            </Link>
            <nav className="flex gap-6">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Sales Data</h1>
        <div className="max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <form className="space-y-4">
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                Choose a file
              </label>
              <input
                id="file"
                type="file"
                accept=".csv,.xlsx"
                className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Upload
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
