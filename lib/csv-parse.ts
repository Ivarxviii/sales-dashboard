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

export const REQUIRED_FIELDS = ["order_id", "date", "customer", "product", "quantity", "amount", "status"] as const

export type ColumnMapping = Record<(typeof REQUIRED_FIELDS)[number], string>

export const FIELD_METADATA: Record<
  (typeof REQUIRED_FIELDS)[number],
  { label: string; description: string; example: string; synonyms: string[] }
> = {
  order_id: {
    label: "Order ID",
    description: "Unique order number",
    example: "#10284",
    synonyms: ["order id", "order number", "id"],
  },
  date: {
    label: "Date",
    description: "When the sale happened",
    example: "2025-03-07",
    synonyms: ["date", "transaction_date", "order_date"],
  },
  customer: {
    label: "Customer",
    description: "Customer or client name",
    example: "Acme Corp",
    synonyms: ["customer", "customer_name", "client"],
  },
  product: {
    label: "Product",
    description: "Item or plan sold",
    example: "Premium Plan",
    synonyms: ["product", "product_name", "item"],
  },
  quantity: {
    label: "Quantity",
    description: "Number of units sold",
    example: "2",
    synonyms: ["quantity", "qty", "units"],
  },
  amount: {
    label: "Amount",
    description: "Revenue, price, or total",
    example: "299",
    synonyms: ["amount", "total", "revenue", "price"],
  },
  status: {
    label: "Status",
    description: "Payment or order status",
    example: "Paid",
    synonyms: ["status", "payment_status", "paid"],
  },
}

const REQUIRED_HEADERS = [...REQUIRED_FIELDS]

export function validateHeaders(headers: string[]): { valid: boolean; message?: string } {
  const lower = headers.map((h) => normalizeHeader(h))
  for (const required of REQUIRED_HEADERS) {
    if (!lower.includes(required)) {
      return { valid: false, message: `Missing required column: ${required}` }
    }
  }
  return { valid: true }
}

function normalizeHeader(h: string): string {
  return h.toLowerCase().trim().replace(/\s+/g, "_")
}

const FIELD_ALIASES: Record<string, string[]> = {
  order_id: ["order_id", "order id", "orderid", "id"],
  date: ["date", "transaction_date", "order_date"],
  customer: ["customer", "customer_name", "client"],
  product: ["product", "product_name", "item"],
  quantity: ["quantity", "qty", "units"],
  amount: ["amount", "total", "revenue", "price"],
  status: ["status", "payment_status", "paid"],
}

export function getDefaultMapping(csvHeaders: string[]): Partial<ColumnMapping> {
  const normalizedHeaders = csvHeaders.map((h) => ({ original: h, normalized: normalizeHeader(h) }))
  const mapping: Partial<ColumnMapping> = {}

  for (const field of REQUIRED_FIELDS) {
    const aliases = FIELD_ALIASES[field] ?? [field]
    const normalizedAliases = aliases.map((a) => a.toLowerCase().replace(/\s+/g, "_"))
    const match = normalizedHeaders.find(({ normalized }) =>
      normalizedAliases.includes(normalized)
    )
    if (match) {
      mapping[field as keyof ColumnMapping] = match.original
    }
  }

  return mapping
}
