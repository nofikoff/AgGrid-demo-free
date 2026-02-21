import type { CellComponent } from 'tabulator-tables'

export function numberFormatter(cell: CellComponent): string {
  const val = cell.getValue()
  if (val == null) return ''
  return Number(val).toLocaleString()
}
