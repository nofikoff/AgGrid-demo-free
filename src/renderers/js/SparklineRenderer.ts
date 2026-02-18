import type { ICellRendererComp, ICellRendererParams } from 'ag-grid-community'

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
      this.drawSparkline(data)
    }
  }

  getGui(): HTMLElement {
    return this.eGui
  }

  refresh(params: ICellRendererParams): boolean {
    const data = params.value as number[]
    if (data && data.length > 1) {
      const ctx = this.canvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.drawSparkline(data)
    }
    return true
  }

  destroy(): void {}

  private drawSparkline(data: number[]): void {
    const ctx = this.canvas.getContext('2d')
    if (!ctx) return

    const w = this.canvas.width
    const h = this.canvas.height
    const pad = 2
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    const step = (w - pad * 2) / (data.length - 1)

    const isUp = data[data.length - 1]! >= data[0]!
    const color = isUp ? '#22c55e' : '#ef4444'

    // Fill area
    ctx.beginPath()
    ctx.moveTo(pad, h)
    data.forEach((val, i) => {
      const x = pad + i * step
      const y = h - pad - ((val - min) / range) * (h - pad * 2)
      ctx.lineTo(x, y)
    })
    ctx.lineTo(pad + (data.length - 1) * step, h)
    ctx.closePath()
    ctx.fillStyle = isUp ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'
    ctx.fill()

    // Draw line
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 1.5
    data.forEach((val, i) => {
      const x = pad + i * step
      const y = h - pad - ((val - min) / range) * (h - pad * 2)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.stroke()

    // End dot
    const lastX = pad + (data.length - 1) * step
    const lastY = h - pad - ((data[data.length - 1]! - min) / range) * (h - pad * 2)
    ctx.beginPath()
    ctx.arc(lastX, lastY, 2.5, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }
}
