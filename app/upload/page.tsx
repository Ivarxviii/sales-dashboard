"use client"

import { useState } from "react"
import Link from "next/link"
import { parseCsv, validateHeaders } from "@/lib/csv-parse"
import { transformToDashboardData, setStoredSalesData } from "@/lib/csv-transform"
import { getSampleCsvContent } from "@/lib/mock-data"

type PreviewRow = Record<string, string>

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([])

  async function loadPreview(selectedFile: File | null) {
    if (!selectedFile) {
      setPreviewRows([])
      return
    }

    try {
      const text = await selectedFile.text()
      const rows = parseCsv(text)
      setPreviewRows(rows.slice(0, 5))
    } catch (error) {
      console.error(error)
      setPreviewRows([])
    }
  }

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

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
  }

  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files?.[0] ?? null
    if (!droppedFile) return

    setFile(droppedFile)
    setStatus("idle")
    setMessage("")
    await loadPreview(droppedFile)
  }

  function handleDownloadSample() {
    const csv = getSampleCsvContent()
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sample-sales-data.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] ?? null
    setFile(selectedFile)
    setStatus("idle")
    setMessage("")
    await loadPreview(selectedFile)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
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
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Upload Sales Data</h1>
        <p className="mb-6 text-gray-600">
          Upload a CSV file to see your sales analytics on the dashboard.
        </p>

        <div className="mb-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <p className="mb-2 text-sm font-medium text-gray-700">
            Don&apos;t have a file yet?
          </p>
          <button
            type="button"
            onClick={handleDownloadSample}
            className="rounded-lg border-2 border-gray-900 bg-gray-900 px-6 py-3 text-base font-semibold text-white hover:bg-gray-800"
          >
            Download sample CSV
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Choose a CSV file
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                  isDragging
                    ? "border-gray-900 bg-blue-50"
                    : file
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                }`}
              >
                {file ? (
                  <>
                    <p className="text-sm font-semibold text-green-800">
                      {file.name} selected
                    </p>
                    <p className="mt-1 text-xs text-green-600">
                      Click Upload below or drop a different file
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-700">
                      Drag and drop your CSV here
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      or choose a file below
                    </p>
                  </>
                )}
              </div>

              <input
                id="file"
                name="file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="mt-4 w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium"
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

            {previewRows.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-800">Preview (first 5 rows)</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Your file is ready to upload
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(previewRows[0]).map((key) => (
                          <th
                            key={key}
                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {previewRows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {Object.values(row).map((value, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="whitespace-nowrap px-4 py-3 text-gray-700"
                            >
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Upload
            </button>
          </form>

          {status === "success" && (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="font-semibold text-green-800">Upload successful</p>
              <p className="mt-1 text-sm text-green-700">{message}</p>
              <Link
                href="/dashboard"
                className="mt-3 inline-block rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
              >
                Go to Dashboard
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-semibold text-red-800">Upload failed</p>
              <p className="mt-1 text-sm text-red-700">{message}</p>
              <p className="mt-2 text-xs text-red-600">
                Check that your CSV has the required columns: order_id, date, customer, product, quantity, amount, status
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}