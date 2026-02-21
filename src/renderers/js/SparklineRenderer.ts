import type { ICellRendererComp, ICellRendererParams } from 'ag-grid-community'
import { drawSparkline } from '../../formatters/sparkline'

export class SparklineRenderer implements ICellRendererComp {
  private eGui!: HTMLDivElement
  private canvas!: HTMLCanvasElement

  init(params: ICellRendererParams): void {
    this.eGui = document.createElement('div')
    this.eGui.style.display = 'flex'
    this.eGui.style.alignItems = 'center'
    this.eGui.style.height = '100%'

    this.canvas = document.createElement('canvas')
    this.canvas.width = 140
    this.canvas.height = 28
    this.canvas.style.display = 'block'
    this.eGui.appendChild(this.canvas)

    const data = params.value as number[]
    if (data && data.length > 1) {
      drawSparkline(this.canvas, data)
    }
  }

  getGui(): HTMLElement {
    return this.eGui
  }

  refresh(params: ICellRendererParams): boolean {
    const data = params.value as number[]
    if (data && data.length > 1) {
      drawSparkline(this.canvas, data)
    }
    return true
  }

  destroy(): void {}
}
