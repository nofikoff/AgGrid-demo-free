import type { CellComponent } from 'tabulator-tables'
import { formatProfit } from '../../formatters/profit'

export function profitFormatter(cell: CellComponent): HTMLElement {
  const result = formatProfit(cell.getValue())
  const el = document.createElement('span')
  el.textContent = result.text
  el.style.fontWeight = '600'
  if (result.color) el.style.color = result.color
  return el
}
