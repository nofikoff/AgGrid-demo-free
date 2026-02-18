<script setup lang="ts">
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef, GridReadyEvent, RowDragEndEvent, GridApi } from 'ag-grid-community'
import { getDragData } from '../data/cache'
import { CurrencyRenderer } from '../renderers/js/CurrencyRenderer'
import { useGridTheme } from '../composables/useGridTheme'
import PageHeader from '../components/PageHeader.vue'

const { currentTheme } = useGridTheme()
const rowData = ref<any[]>([])
const gridApi = ref<GridApi | null>(null)
const saved = ref(false)

const columnDefs: ColDef[] = [
  {
    field: 'priority',
    headerName: '#',
    width: 80,
    rowDrag: true,
    valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
  },
  { field: 'campaignName', headerName: 'Campaign', flex: 2 },
  {
    field: 'status',
    headerName: 'Status',
    width: 110,
    cellRenderer: (params: any) => {
      const status = params.value as string
      const cls = `status-${status}`
      return `<span class="${cls}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`
    },
  },
  { field: 'dailyBudget', headerName: 'Daily Budget', cellRenderer: CurrencyRenderer, width: 140 },
  { field: 'spend', headerName: 'Spend', cellRenderer: CurrencyRenderer, width: 120 },
  {
    field: 'installs',
    headerName: 'Installs',
    width: 110,
    valueFormatter: (p) => p.value?.toLocaleString() ?? '',
  },
  { field: 'cpi', headerName: 'CPI', cellRenderer: CurrencyRenderer, width: 100 },
]

const defaultColDef: ColDef = {
  sortable: false,
  resizable: true,
}

function onGridReady(params: GridReadyEvent) {
  gridApi.value = params.api
  rowData.value = getDragData()
}

function onRowDragEnd(_event: RowDragEndEvent) {
  saved.value = false
  gridApi.value?.refreshCells({ columns: ['priority'], force: true })
}

function saveOrder() {
  const newOrder: any[] = []
  gridApi.value?.forEachNode((node, index) => {
    if (node.data) {
      newOrder.push({ ...node.data, priority: index + 1 })
    }
  })
  rowData.value = newOrder
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}
</script>

<template>
  <div>
    <PageHeader
      title="Drag & Drop Priority"
      description="Drag rows to reorder campaign priority. rowDragManaged is a free Community feature — no Enterprise license needed."
    />

    <div class="toolbar">
      <n-button type="primary" @click="saveOrder">Save Order</n-button>
      <n-tag v-if="saved" type="success" round>Saved!</n-tag>
    </div>

    <div :class="currentTheme" style="height: calc(100vh - 200px)">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :defaultColDef="defaultColDef"
        :rowDragManaged="true"
        :animateRows="true"
        :suppressMoveWhenRowDragging="false"
        @grid-ready="onGridReady"
        @row-drag-end="onRowDragEnd"
      />
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
</style>
