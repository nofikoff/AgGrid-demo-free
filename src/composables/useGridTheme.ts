import { ref } from 'vue'

const THEMES = ['ag-theme-quartz', 'ag-theme-alpine', 'ag-theme-balham'] as const
type GridTheme = (typeof THEMES)[number]

const currentTheme = ref<GridTheme>(
  (localStorage.getItem('ag-grid-theme') as GridTheme) || 'ag-theme-quartz',
)

export function useGridTheme() {
  function setTheme(theme: GridTheme) {
    currentTheme.value = theme
    localStorage.setItem('ag-grid-theme', theme)
  }

  return {
    currentTheme,
    themes: THEMES,
    setTheme,
  }
}
