import type { ICellRendererComp, ICellRendererParams } from 'ag-grid-community'
import { formatPercent } from '../../formatters/percent'

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
    const result = formatPercent(value as number)
    this.eGui.textContent = result.text
    this.eGui.style.color = result.color
  }
}
