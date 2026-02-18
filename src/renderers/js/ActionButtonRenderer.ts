import type { ICellRendererComp, ICellRendererParams } from 'ag-grid-community'

export class ActionButtonRenderer implements ICellRendererComp {
  private eGui!: HTMLButtonElement
  private params!: ICellRendererParams

  init(params: ICellRendererParams): void {
    this.params = params
    this.eGui = document.createElement('button')
    this.eGui.textContent = params.colDef?.cellRendererParams?.buttonText ?? 'Details'
    this.eGui.className = 'ag-action-btn'
    this.eGui.addEventListener('click', this.onClick)
  }

  getGui(): HTMLElement {
    return this.eGui
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params
    return true
  }

  destroy(): void {
    this.eGui.removeEventListener('click', this.onClick)
  }

  private onClick = (e: Event): void => {
    e.stopPropagation()
    const event = new CustomEvent('grid-action', {
      bubbles: true,
      detail: { action: 'showDetails', data: this.params.data },
    })
    this.eGui.dispatchEvent(event)
  }
}
