import type { ICellRendererComp, ICellRendererParams } from 'ag-grid-community'

export class PercentRenderer implements ICellRendererComp {
  private eGui!: HTMLSpanElement

  init(params: ICellRendererParams): void {
    this.eGui = document.createElement('span')
    this.updateValue(params.value)
  }

  getGui(): HTMLElement {
    return this.eGui
  }

  refresh(params: ICellRendererParams): boolean {
    this.updateValue(params.value)
    return true
  }

  destroy(): void {}

  private updateValue(value: unknown): void {
    const num = value as number
    if (num == null) {
      this.eGui.textContent = '—'
      return
    }
    const pct = (num * 100).toFixed(2)
    this.eGui.textContent = `${pct}%`
    if (num > 0) {
      this.eGui.style.color = '#16a34a'
    } else if (num < 0) {
      this.eGui.style.color = '#dc2626'
    } else {
      this.eGui.style.color = ''
    }
  }
}
