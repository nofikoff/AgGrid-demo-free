import type { CellComponent } from 'tabulator-tables'
import { formatCurrency } from '../../formatters/currency'

export function currencyFormatter(cell: CellComponent): string {
  return formatCurrency(cell.getValue())
}
