export type EngineType = 'aggrid' | 'tabulator' | 'primevue'

export interface EngineMeta {
  label: string
  badge: string
  color: string
  license: string
}

export const ENGINE_META: Record<EngineType, EngineMeta> = {
  aggrid: {
    label: 'AG Grid',
    badge: 'ag-grid-community',
    color: '#22c55e',
    license: 'MIT License',
  },
  tabulator: {
    label: 'Tabulator',
    badge: 'tabulator-tables',
    color: '#3b82f6',
    license: 'MIT License',
  },
  primevue: {
    label: 'PrimeVue',
    badge: 'primevue',
    color: '#a855f7',
    license: 'MIT License',
  },
}

export const ENGINE_OPTIONS: EngineType[] = ['aggrid', 'tabulator', 'primevue']
