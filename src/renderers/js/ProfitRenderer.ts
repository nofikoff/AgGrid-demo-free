import type { ICellRendererComp, ICellRendererParams } from 'ag-grid-community'
import { formatProfit } from '../../formatters/profit'

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
    const result = formatProfit(value as number)
    this.eGui.textContent = result.text
    this.eGui.style.color = result.color
  }
}
