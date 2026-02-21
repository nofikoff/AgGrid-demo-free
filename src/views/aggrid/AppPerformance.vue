<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community'
import { getAppData } from '../../data/cache'
import { CurrencyRenderer } from '../../renderers/js/CurrencyRenderer'
import { PercentRenderer } from '../../renderers/js/PercentRenderer'
import { CheckboxRenderer } from '../../renderers/js/CheckboxRenderer'
import VueCheckboxRenderer from '../../renderers/vue/VueCheckboxRenderer.vue'
import { usePerformanceMetrics } from '../../composables/usePerformanceMetrics'
import { useGridTheme } from '../../composables/useGridTheme'
import PageHeader from '../../components/PageHeader.vue'
import PerformancePanel from '../../components/PerformancePanel.vue'

const { currentTheme } = useGridTheme()
const { fps, renderTime, rowCount, startMeasuring, stopMeasuring, recordRenderTime, setRowCount } =
  usePerformanceMetrics()

type RendererMode = 'js' | 'vue' | 'builtin'
const mode = ref<RendererMode>('js')
const rowData = ref<any[]>([])
const gridApi = ref<GridApi | null>(null)
const gridKey = ref(0)
let renderStart = 0

const baseColumns: ColDef[] = [
  { field: 'appName', headerName: 'App', width: 180 },
  { field: 'bundleId', headerName: 'Bundle ID', width: 200 },
  { field: 'category', headerName: 'Category', width: 140 },
  {
    field: 'installs',
    headerName: 'Installs',
    width: 120,
    valueFormatter: (p) => p.value?.toLocaleString() ?? '',
  },
  { field: 'revenue', headerName: 'Revenue', cellRenderer: CurrencyRenderer, width: 130 },
  {
    field: 'dau',
    headerName: 'DAU',
    width: 110,
    valueFormatter: (p) => p.value?.toLocaleString() ?? '',
  },
  { field: 'retentionD1', headerName: 'D1 Ret.', cellRenderer: PercentRenderer, width: 100 },
  { field: 'retentionD7', headerName: 'D7 Ret.', cellRenderer: PercentRenderer, width: 100 },
]

const columnDefs = computed<ColDef[]>(() => {
  const checkboxCol: ColDef = { field: 'selected', headerName: 'Select', width: 90 }

  if (mode.value === 'vue') {
    checkboxCol.cellRenderer = VueCheckboxRenderer
  } else if (mode.value === 'js') {
    checkboxCol.cellRenderer = CheckboxRenderer
  } else {
    checkboxCol.checkboxSelection = true
    checkboxCol.headerCheckboxSelection = true
  }

  return [checkboxCol, ...baseColumns]
})

const defaultColDef: ColDef = {
  sortable: true,
  resizable: true,
}

function onGridReady(params: GridReadyEvent) {
  gridApi.value = params.api
  const data = getAppData(50_000)
  rowData.value = data
  setRowCount(data.length)
  startMeasuring()
}

function onFirstDataRendered() {
  recordRenderTime(renderStart)
}

watch(mode, () => {
  stopMeasuring()
  renderStart = performance.now()
  gridKey.value++
  nextTick(() => {
    startMeasuring()
  })
})

const modeDescriptions: Record<RendererMode, string> = {
  vue: 'Vue Component — each checkbox is a mini Vue app instance. Watch FPS drop during scroll.',
  js: 'JS Class Renderer — plain DOM operations, no Vue overhead. Smooth scrolling.',
  builtin: 'Built-in checkboxSelection — AG Grid native, zero overhead. Best performance.',
}
</script>

<template>
  <div>
    <PageHeader
      title="App Performance — Checkbox A/B Test"
      description="Compare three checkbox approaches on 50,000 rows. Toggle the mode and scroll to see FPS differences."
      badge="Pain Point #1"
    />

    <div class="controls">
      <n-radio-group v-model:value="mode" size="medium">
        <n-radio-button value="js" label="JS Class (Fast)" />
        <n-radio-button value="vue" label="Vue Component (Slow)" />
        <n-radio-button value="builtin" label="Built-in (Fastest)" />
      </n-radio-group>
      <PerformancePanel :fps="fps" :render-time="renderTime" :row-count="rowCount" :label="mode" />
    </div>

    <n-alert :type="mode === 'vue' ? 'warning' : 'success'" style="margin-bottom: 12px">
      {{ modeDescriptions[mode] }}
    </n-alert>

    <div :class="currentTheme" style="height: calc(100vh - 260px)">
      <ag-grid-vue
        :key="gridKey"
        style="width: 100%; height: 100%"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :defaultColDef="defaultColDef"
        :pagination="true"
        :paginationPageSize="100"
        :paginationPageSizeSelector="[50, 100, 500]"
        :animateRows="false"
        :rowSelection="mode === 'builtin' ? 'multiple' : undefined"
        :suppressRowClickSelection="mode === 'builtin'"
        :suppressCellFocus="true"
        @grid-ready="onGridReady"
        @first-data-rendered="onFirstDataRendered"
      />
    </div>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
</style>
