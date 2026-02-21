declare module 'tabulator-tables' {
  export interface ColumnDefinition {
    title?: string
    field?: string
    width?: number
    minWidth?: number
    maxWidth?: number
    hozAlign?: 'left' | 'center' | 'right'
    vertAlign?: 'top' | 'middle' | 'bottom'
    formatter?: string | ((cell: CellComponent, formatterParams: any, onRendered: (callback: () => void) => void) => string | HTMLElement)
    formatterParams?: any
    sorter?: string
    headerSort?: boolean
    frozen?: boolean
    rowHandle?: boolean
    resizable?: boolean | string
    cssClass?: string
    headerFilter?: boolean | string
    [key: string]: any
  }

  export interface CellComponent {
    getValue(): any
    getElement(): HTMLElement
    getRow(): RowComponent
    getData(): any
    getField(): string
    getColumn(): ColumnComponent
  }

  export interface RowComponent {
    getData(): any
    getElement(): HTMLElement
    getIndex(): number | string
    getPosition(): number
    getCells(): CellComponent[]
    getTreeChildren(): RowComponent[]
    delete(): Promise<void>
    update(data: any): Promise<void>
    reformat(): void
    toggleSelect(): void
    isSelected(): boolean
  }

  export interface ColumnComponent {
    getField(): string
    getDefinition(): ColumnDefinition
    getElement(): HTMLElement
  }

  export interface Options {
    data?: any[]
    columns?: ColumnDefinition[]
    height?: string | number
    layout?: 'fitData' | 'fitDataFill' | 'fitDataStretch' | 'fitDataTable' | 'fitColumns'
    pagination?: boolean
    paginationSize?: number
    paginationSizeSelector?: number[] | boolean
    movableRows?: boolean
    reactiveData?: boolean
    placeholder?: string
    initialSort?: { column: string; dir: 'asc' | 'desc' }[]
    renderComplete?: () => void
    rowFormatter?: (row: RowComponent) => void
    index?: string
    [key: string]: any
  }

  export class TabulatorFull {
    constructor(element: string | HTMLElement, options: Options)
    setData(data: any[]): Promise<void>
    replaceData(data: any[]): Promise<void>
    getData(activeOnly?: string): any[]
    getRows(activeOnly?: string): RowComponent[]
    addRow(data: any, pos?: boolean, index?: number): Promise<RowComponent>
    deleteRow(index: number | string | RowComponent): Promise<void>
    updateRow(index: number | string, data: any): Promise<void>
    updateData(data: any[]): Promise<void>
    clearData(): void
    on(event: string, callback: (...args: any[]) => void): void
    off(event: string, callback?: (...args: any[]) => void): void
    destroy(): void
    redraw(force?: boolean): void
    setColumns(columns: ColumnDefinition[]): void
    getColumn(field: string): ColumnComponent | false
    setSort(sorters: string | { column: string; dir: 'asc' | 'desc' }[]): void
    setFilter(field: string | ((data: any) => boolean), type?: string, value?: any): void
    clearFilter(all?: boolean): void
    getSelectedData(): any[]
    selectRow(lookup?: number | string | RowComponent | RowComponent[]): void
    deselectRow(lookup?: number | string | RowComponent | RowComponent[]): void
  }

  export { TabulatorFull as Tabulator }
  export default TabulatorFull
}
