import type { CellComponent } from 'tabulator-tables'
import { COUNTRIES } from '../../data/constants'

const countryMap = new Map(COUNTRIES.map((c) => [c.code, c]))

export function flagFormatter(cell: CellComponent): string {
  const data = cell.getData()
  const code = data.countryCode as string
  const info = countryMap.get(code)
  if (info) return `${info.flag} ${info.name}`
  return cell.getValue() ?? ''
}
