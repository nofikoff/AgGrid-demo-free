import type { ICellRendererComp, ICellRendererParams } from 'ag-grid-community'
import { formatCurrency } from '../../formatters/currency'

export class CurrencyRenderer implements ICellRendererComp {
  private eGui!: HTMLSpanElement

  init(params: ICellRendererParams): void {
    this.eGui = document.createElement('span')
    this.eGui.textContent = formatCurrency(params.value as number)
  }

  getGui(): HTMLElement {
    return this.eGui
  }

  refresh(params: ICellRendererParams): boolean {
    this.eGui.textContent = formatCurrency(params.value as number)
    return true
  }

  destroy(): void {}
}
