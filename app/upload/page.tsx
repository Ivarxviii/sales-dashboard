"use client"

import { useState } from "react"
import Link from "next/link"
import { parseCsv, validateHeaders } from "@/lib/csv-parse"
import { transformToDashboardData, setStoredSalesData } from "@/lib/csv-transform"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("idle")
    setMessage("")

    if (!file) {
      setStatus("error")
      setMessage("Please select a CSV file.")
      return
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setStatus("error")
      setMessage("Please select a .csv file.")
      return
    }

    try {
      const text = await file.text()
      const rows = parseCsv(text)
      const headers = rows.length > 0 ? Object.keys(rows[0]) : []

      const { valid, message: msg } = validateHeaders(headers)
      if (!valid) {
        setStatus("error")
        setMessage(msg ?? "Invalid CSV headers.")
        return
      }

      const data = transformToDashboardData(rows)
      setStoredSalesData(data)

      setStatus("success")
      setMessage("Upload successful! View your data on the dashboard.")
    } catch (error) {
      console.error(error)
      setStatus("error")
      setMessage("Could not read or parse the file. Please check the format.")
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Upload Sales Data TEST</h1>

        <div className="max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="file" className="mb-2 block text-sm font-medium text-gray-700">
                Choose a CSV file
              </label>

              <input
                id="file"
                name="file"
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium"
              />

              <p className="mt-2 text-xs text-gray-500">
                Required columns: order_id, date, customer, product, quantity, amount, status
              </p>

              {file && (
                <p className="mt-2 text-sm text-gray-700">
                  Selected file: <span className="font-medium">{file.name}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Upload
            </button>
          </form>

          {status === "success" && (
            <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
              {message}
              <Link href="/dashboard" className="ml-2 font-medium underline">
                Go to Dashboard
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}