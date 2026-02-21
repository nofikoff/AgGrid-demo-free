import type { CellComponent } from 'tabulator-tables'
import { formatPercent } from '../../formatters/percent'

export function percentFormatter(cell: CellComponent): string | HTMLElement {
  const result = formatPercent(cell.getValue())
  const el = document.createElement('span')
  el.textContent = result.text
  if (result.color) el.style.color = result.color
  return el
}
