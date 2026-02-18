import type { ICellRendererComp, ICellRendererParams } from 'ag-grid-community'
import { COUNTRIES } from '../../data/constants'

const countryMap = new Map(COUNTRIES.map((c) => [c.code, c]))

export class FlagRenderer implements ICellRendererComp {
  private eGui!: HTMLSpanElement

  init(params: ICellRendererParams): void {
    this.eGui = document.createElement('span')
    this.updateValue(params)
  }

  getGui(): HTMLElement {
    return this.eGui
  }

  refresh(params: ICellRendererParams): boolean {
    this.updateValue(params)
    return true
  }

  destroy(): void {}

  private updateValue(params: ICellRendererParams): void {
    const code = params.data?.countryCode as string
    const info = countryMap.get(code)
    if (info) {
      this.eGui.textContent = `${info.flag} ${info.name}`
    } else {
      this.eGui.textContent = params.value as string
    }
  }
}
