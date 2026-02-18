import type { ICellRendererComp, ICellRendererParams } from 'ag-grid-community'

export class CheckboxRenderer implements ICellRendererComp {
  private eGui!: HTMLInputElement
  private params!: ICellRendererParams

  init(params: ICellRendererParams): void {
    this.params = params
    this.eGui = document.createElement('input')
    this.eGui.type = 'checkbox'
    this.eGui.checked = !!params.value
    this.eGui.style.cursor = 'pointer'
    this.eGui.style.width = '16px'
    this.eGui.style.height = '16px'
    this.eGui.addEventListener('change', this.onChange)
  }

  getGui(): HTMLElement {
    return this.eGui
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params
    this.eGui.checked = !!params.value
    return true
  }

  destroy(): void {
    this.eGui.removeEventListener('change', this.onChange)
  }

  private onChange = (): void => {
    const colId = this.params.column!.getColId()
    this.params.node.setDataValue(colId, this.eGui.checked)
  }
}
