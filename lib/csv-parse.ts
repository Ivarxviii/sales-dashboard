/**
 * Parse a CSV string into an array of row objects.
 * First row is treated as headers. Supports quoted cells.
 */
export function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []

  const headers = parseRow(lines[0])
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i])
    const row: Record<string, string> = {}
    headers.forEach((header, j) => {
      row[header] = values[j] ?? ""
    })
    rows.push(row)
  }

  return rows
}

/** Parse a single CSV row, handling quoted values with commas */
function parseRow(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

const REQUIRED_HEADERS = ["order_id", "date", "customer", "product", "quantity", "amount", "status"]

export function validateHeaders(headers: string[]): { valid: boolean; message?: string } {
  const lower = headers.map((h) => h.toLowerCase().trim())
  for (const required of REQUIRED_HEADERS) {
    if (!lower.includes(required)) {
      return { valid: false, message: `Missing required column: ${required}` }
    }
  }
  return { valid: true }
}
