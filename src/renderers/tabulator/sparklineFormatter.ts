import type { CellComponent } from 'tabulator-tables'
import { drawSparkline } from '../../formatters/sparkline'

export function sparklineFormatter(
  cell: CellComponent,
  _formatterParams: any,
  onRendered: (callback: () => void) => void,
): HTMLElement {
  const wrapper = document.createElement('div')
  wrapper.style.display = 'flex'
  wrapper.style.alignItems = 'center'
  wrapper.style.height = '100%'

  const canvas = document.createElement('canvas')
  canvas.width = 140
  canvas.height = 28
  canvas.style.display = 'block'
  wrapper.appendChild(canvas)

  onRendered(() => {
    const data = cell.getValue() as number[]
    if (data && data.length > 1) {
      drawSparkline(canvas, data)
    }
  })

  return wrapper
}
