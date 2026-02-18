import type { ICellRendererComp, ICellRendererParams } from 'ag-grid-community'

export class ProfitRenderer implements ICellRendererComp {
  private eGui!: HTMLSpanElement

  init(params: ICellRendererParams): void {
    this.eGui = document.createElement('span')
    this.eGui.style.fontWeight = '600'
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
    const formatted = `$${Math.abs(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    if (num > 0) {
      this.eGui.textContent = `▲ +${formatted}`
      this.eGui.style.color = '#16a34a'
    } else if (num < 0) {
      this.eGui.textContent = `▼ -${formatted}`
      this.eGui.style.color = '#dc2626'
    } else {
      this.eGui.textContent = `${formatted}`
      this.eGui.style.color = '#6b7280'
    }
  }
}
