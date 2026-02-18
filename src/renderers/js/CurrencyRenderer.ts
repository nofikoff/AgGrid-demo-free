import type { ICellRendererComp, ICellRendererParams } from 'ag-grid-community'

export class CurrencyRenderer implements ICellRendererComp {
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
    this.eGui.textContent =
      num != null
        ? `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : '—'
  }
}
