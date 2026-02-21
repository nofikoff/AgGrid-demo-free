import type { CellComponent } from 'tabulator-tables'

export function statusFormatter(cell: CellComponent): HTMLElement {
  const status = cell.getValue() as string
  const el = document.createElement('span')
  el.className = `status-${status}`
  el.textContent = status.charAt(0).toUpperCase() + status.slice(1)
  return el
}
