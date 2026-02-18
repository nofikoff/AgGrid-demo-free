import type { ICellRendererComp, ICellRendererParams } from 'ag-grid-community'

export class ExpandRowRenderer implements ICellRendererComp {
  private eGui!: HTMLSpanElement
  private params!: ICellRendererParams

  init(params: ICellRendererParams): void {
    this.params = params

    if (params.data?._isDetail) {
      this.eGui = document.createElement('span')
      this.eGui.textContent = ''
      return
    }

    this.eGui = document.createElement('span')
    this.eGui.style.cursor = 'pointer'
    this.eGui.style.userSelect = 'none'
    this.eGui.style.fontSize = '14px'
    this.eGui.style.padding = '4px 8px'
    this.eGui.textContent = params.data?._expanded ? '▼' : '▶'
    this.eGui.addEventListener('click', this.onToggle)
  }

  getGui(): HTMLElement {
    return this.eGui
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params
    if (!params.data?._isDetail) {
      this.eGui.textContent = params.data?._expanded ? '▼' : '▶'
    }
    return true
  }

  destroy(): void {
    this.eGui.removeEventListener('click', this.onToggle)
  }

  private onToggle = (e: Event): void => {
    e.stopPropagation()
    const event = new CustomEvent('grid-action', {
      bubbles: true,
      detail: { action: 'toggleExpand', data: this.params.data },
    })
    this.eGui.dispatchEvent(event)
  }
}
