<script setup lang="ts">
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community'
import { getCampaignData } from '../../data/cache'
import { CurrencyRenderer } from '../../renderers/js/CurrencyRenderer'
import { PercentRenderer } from '../../renderers/js/PercentRenderer'
import { ProfitRenderer } from '../../renderers/js/ProfitRenderer'
import { FlagRenderer } from '../../renderers/js/FlagRenderer'
import { usePerformanceMetrics } from '../../composables/usePerformanceMetrics'
import { useGridTheme } from '../../composables/useGridTheme'
import PageHeader from '../../components/PageHeader.vue'
import PerformancePanel from '../../components/PerformancePanel.vue'

const { currentTheme } = useGridTheme()
const { fps, renderTime, rowCount, startMeasuring, recordRenderTime, setRowCount } =
  usePerformanceMetrics()

const rowData = ref<any[]>([])
const gridApi = ref<GridApi | null>(null)
const quickFilter = ref('')
const renderStart = ref(0)

const columnDefs: ColDef[] = [
  { field: 'campaignName', headerName: 'Campaign', pinned: 'left', width: 280, filter: true },
  { field: 'advertiser', headerName: 'Advertiser', width: 160 },
  { field: 'country', headerName: 'Country', cellRenderer: FlagRenderer, width: 180 },
  { field: 'appName', headerName: 'App', width: 160 },
  { field: 'category', headerName: 'Category', width: 130 },
  { field: 'month', headerName: 'Month', width: 100 },
  {
    field: 'impressions',
    headerName: 'Impressions',
    width: 130,
    valueFormatter: (p) => p.value?.toLocaleString() ?? '',
  },
  {
    field: 'clicks',
    headerName: 'Clicks',
    width: 110,
    valueFormatter: (p) => p.value?.toLocaleString() ?? '',
  },
  { field: 'ctr', headerName: 'CTR', cellRenderer: PercentRenderer, width: 100 },
  {
    field: 'installs',
    headerName: 'Installs',
    width: 110,
    valueFormatter: (p) => p.value?.toLocaleString() ?? '',
  },
  { field: 'cpi', headerName: 'CPI', cellRenderer: CurrencyRenderer, width: 100 },
  { field: 'revenue', headerName: 'Revenue', cellRenderer: CurrencyRenderer, width: 130 },
  { field: 'spend', headerName: 'Spend', cellRenderer: CurrencyRenderer, width: 130 },
  { field: 'profit', headerName: 'Profit', cellRenderer: ProfitRenderer, width: 150 },
  { field: 'roi', headerName: 'ROI', cellRenderer: PercentRenderer, width: 100 },
  {
    field: 'dau',
    headerName: 'DAU',
    width: 120,
    valueFormatter: (p) => p.value?.toLocaleString() ?? '',
  },
]

const defaultColDef: ColDef = {
  sortable: true,
  resizable: true,
}

function onGridReady(params: GridReadyEvent) {
  gridApi.value = params.api
  renderStart.value = performance.now()
  const data = getCampaignData(100_000)
  rowData.value = data
  setRowCount(data.length)
  startMeasuring()
}

function onFirstDataRendered() {
  recordRenderTime(renderStart.value)
}

function onFilterChange() {
  gridApi.value?.setGridOption('quickFilterText', quickFilter.value)
}
</script>

<template>
  <div>
    <PageHeader
      title="Campaign Report"
      description="100,000 rows with JS cell renderers, client-side pagination & sorting. All rendering is virtualized — only visible rows exist in DOM."
    />

    <div class="toolbar">
      <n-input
        v-model:value="quickFilter"
        placeholder="Quick filter..."
        clearable
        style="width: 300px"
        @update:value="onFilterChange"
      />
      <PerformancePanel :fps="fps" :render-time="renderTime" :row-count="rowCount" />
    </div>

    <div :class="currentTheme" style="height: calc(100vh - 180px)">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :defaultColDef="defaultColDef"
        :pagination="true"
        :paginationPageSize="100"
        :paginationPageSizeSelector="[50, 100, 500, 1000]"
        :animateRows="false"
        :suppressCellFocus="true"
        @grid-ready="onGridReady"
        @first-data-rendered="onFirstDataRendered"
      />
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
</style>
