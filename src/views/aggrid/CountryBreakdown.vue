<script setup lang="ts">
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef, GridReadyEvent } from 'ag-grid-community'
import { getCountryData } from '../../data/cache'
import { CurrencyRenderer } from '../../renderers/js/CurrencyRenderer'
import { ProfitRenderer } from '../../renderers/js/ProfitRenderer'
import { SparklineRenderer } from '../../renderers/js/SparklineRenderer'
import { useGridTheme } from '../../composables/useGridTheme'
import PageHeader from '../../components/PageHeader.vue'

const { currentTheme } = useGridTheme()
const rowData = ref<any[]>([])

const columnDefs: ColDef[] = [
  {
    field: 'country',
    headerName: 'Country',
    width: 200,
    cellRenderer: (params: any) => {
      return `${params.data.flagEmoji} ${params.value}`
    },
    pinned: 'left',
  },
  {
    field: 'clicks',
    headerName: 'Clicks',
    width: 130,
    valueFormatter: (p) => p.value?.toLocaleString() ?? '',
  },
  {
    field: 'installs',
    headerName: 'Installs',
    width: 120,
    valueFormatter: (p) => p.value?.toLocaleString() ?? '',
  },
  { field: 'revenue', headerName: 'Revenue', cellRenderer: CurrencyRenderer, width: 140 },
  { field: 'spend', headerName: 'Spend', cellRenderer: CurrencyRenderer, width: 130 },
  { field: 'profit', headerName: 'Profit', cellRenderer: ProfitRenderer, width: 160 },
  {
    field: 'dau',
    headerName: 'DAU',
    width: 130,
    valueFormatter: (p) => p.value?.toLocaleString() ?? '',
  },
  {
    field: 'revenueHistory',
    headerName: 'Revenue Trend (30d)',
    cellRenderer: SparklineRenderer,
    width: 180,
    sortable: false,
  },
]

const defaultColDef: ColDef = {
  sortable: true,
  resizable: true,
}

function onGridReady(params: GridReadyEvent) {
  rowData.value = getCountryData()
  params.api.applyColumnState({
    state: [{ colId: 'revenue', sort: 'desc' }],
  })
}
</script>

<template>
  <div>
    <PageHeader
      title="Country Breakdown"
      description="Canvas-based sparkline charts in cells — no Enterprise license needed. Each sparkline is a lightweight 140x28 canvas element drawn with plain JS."
      badge="Canvas Sparklines"
    />

    <div :class="currentTheme" style="height: calc(100vh - 160px)">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :defaultColDef="defaultColDef"
        :animateRows="true"
        @grid-ready="onGridReady"
      />
    </div>
  </div>
</template>
