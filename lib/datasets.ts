import type { SalesData, SalesRow } from "@/lib/csv-transform"
import { getDefaultData } from "@/lib/csv-transform"

const STORAGE_KEY = "sales-dashboard-data"

export type Dataset = {
  id: string
  name: string
  data: SalesData
  rows?: SalesRow[]
}

export type DatasetsState = {
  activeId: string | null
  datasets: Dataset[]
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function normalizeSalesData(raw: unknown): SalesData | null {
  if (!raw || typeof raw !== "object") return null
  const d = raw as Record<string, unknown>
  if (!d.kpis || !Array.isArray(d.revenueByMonth) || !Array.isArray(d.topProducts) || !Array.isArray(d.recentOrders)) {
    return null
  }
  const rawInsights = d.insights ?? []
  const insights = Array.isArray(rawInsights)
    ? rawInsights.map((i: unknown) => (typeof i === "string" ? { text: i } : i))
    : []
  return {
    ...d,
    topCustomers: Array.isArray(d.topCustomers) ? d.topCustomers : [],
    insights,
  } as SalesData
}

function isOldFormat(data: unknown): data is Record<string, unknown> & { kpis: unknown; revenueByMonth: unknown } {
  if (!data || typeof data !== "object") return false
  const d = data as Record<string, unknown>
  return !!d.kpis && !!d.revenueByMonth && !!d.topProducts && !!d.recentOrders && !Array.isArray(d.datasets)
}

export function getDatasetsState(): DatasetsState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)

    if (isOldFormat(parsed)) {
      const normalized = normalizeSalesData(parsed)
      if (!normalized) return null
      const id = generateId()
      const migrated: DatasetsState = {
        activeId: id,
        datasets: [{ id, name: "Imported data", data: normalized }],
      }
      setDatasetsState(migrated)
      return migrated
    }

    const state = parsed as { activeId?: string | null; datasets?: unknown[] }
    if (!state || !Array.isArray(state.datasets)) return null

    const datasets: Dataset[] = []
    for (const item of state.datasets) {
      if (item && typeof item === "object" && typeof (item as Dataset).id === "string" && typeof (item as Dataset).name === "string") {
        const anyItem = item as Dataset & { rows?: unknown }
        const norm = normalizeSalesData(anyItem.data)
        if (!norm) continue

        let rows: SalesRow[] | undefined
        if (Array.isArray(anyItem.rows)) {
          rows = anyItem.rows as SalesRow[]
        }

        datasets.push({
          id: anyItem.id,
          name: anyItem.name,
          data: norm,
          rows,
        })
      }
    }

    let activeId = state.activeId ?? null
    if (activeId && !datasets.some((d) => d.id === activeId)) {
      activeId = datasets.length > 0 ? datasets[0].id : null
    }
    if (!activeId && datasets.length > 0) activeId = datasets[0].id

    return { activeId, datasets }
  } catch {
    return null
  }
}

function setDatasetsState(state: DatasetsState): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function getActiveData(): SalesData | null {
  const state = getDatasetsState()
  if (!state) return null
  if (!state.activeId) return null
  const found = state.datasets.find((d) => d.id === state.activeId)
  return found?.data ?? null
}

export function getActiveDataset(): Dataset | null {
  const state = getDatasetsState()
  if (!state || !state.activeId) return null
  const found = state.datasets.find((d) => d.id === state.activeId)
  return found ?? null
}

export function addDataset(name: string, data: SalesData, rows?: SalesRow[]): string {
  const state = getDatasetsState() ?? { activeId: null, datasets: [] }
  const id = generateId()
  const dataset: Dataset = { id, name: name.trim() || "Untitled", data, rows }
  const next: DatasetsState = {
    activeId: id,
    datasets: [...state.datasets, dataset],
  }
  setDatasetsState(next)
  return id
}

export function setActiveDataset(id: string | null): void {
  const state = getDatasetsState()
  if (!state) return
  if (id && !state.datasets.some((d) => d.id === id)) return
  setDatasetsState({ ...state, activeId: id })
}

export function deleteDataset(id: string): void {
  const state = getDatasetsState()
  if (!state) return
  const nextDatasets = state.datasets.filter((d) => d.id !== id)
  let nextActiveId = state.activeId
  if (state.activeId === id) {
    nextActiveId = nextDatasets.length > 0 ? nextDatasets[0].id : null
  }
  setDatasetsState({ activeId: nextActiveId, datasets: nextDatasets })
}
