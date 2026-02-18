<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef, GridReadyEvent, GridApi, RowClassParams, CellClickedEvent } from 'ag-grid-community'
import { getDailyRevenueData } from '../data/cache'
import type { DailyRevenueRow, SourceBreakdown } from '../types/adtech'
import { CurrencyRenderer } from '../renderers/js/CurrencyRenderer'
import { ProfitRenderer } from '../renderers/js/ProfitRenderer'
import { ActionButtonRenderer } from '../renderers/js/ActionButtonRenderer'
import { useGridTheme } from '../composables/useGridTheme'
import PageHeader from '../components/PageHeader.vue'

const { currentTheme } = useGridTheme()
const gridApi = ref<GridApi | null>(null)
const showPopup = ref(false)
const popupData = ref<DailyRevenueRow | null>(null)
const gridWrapper = ref<HTMLElement | null>(null)

let masterData: DailyRevenueRow[] = []

const columnDefs: ColDef[] = [
  {
    headerName: '',
    field: '_expand',
    width: 60,
    sortable: false,
    resizable: false,
    cellRenderer: (params: any) => {
      if (params.data?._isDetail) return ''
      return params.data?._expanded ? '▼' : '▶'
    },
    cellStyle: { cursor: 'pointer', textAlign: 'center', fontSize: '14px' },
  },
  { field: 'date', headerName: 'Date', width: 200, cellRenderer: (params: any) => params.value ?? '' },
  { field: 'totalRevenue', headerName: 'Revenue', cellRenderer: CurrencyRenderer, width: 140 },
  { field: 'totalSpend', headerName: 'Spend', cellRenderer: CurrencyRenderer, width: 130 },
  { field: 'profit', headerName: 'Profit', cellRenderer: ProfitRenderer, width: 160 },
  {
    field: 'transactions',
    headerName: 'Transactions',
    width: 130,
    valueFormatter: (p) => p.value?.toLocaleString() ?? '',
  },
  {
    headerName: 'Actions',
    field: 'actions',
    cellRenderer: ActionButtonRenderer,
    cellRendererParams: { buttonText: 'Details' },
    width: 100,
    sortable: false,
  },
]

const defaultColDef: ColDef = {
  sortable: true,
  resizable: true,
}

function getRowClass(params: RowClassParams): string | undefined {
  if (params.data?._isDetail) return 'ag-row-detail'
  return undefined
}

function onGridReady(params: GridReadyEvent) {
  gridApi.value = params.api
  masterData = getDailyRevenueData().map((r) => ({ ...r }))
  params.api.setGridOption('rowData', [...masterData])
}

function onCellClicked(event: CellClickedEvent) {
  if (event.colDef.field === '_expand' && !event.data._isDetail) {
    toggleExpand(event.data)
  }
}

function handleGridAction(e: Event) {
  const event = e as CustomEvent
  const { action, data } = event.detail
  if (action === 'showDetails') {
    popupData.value = data
    showPopup.value = true
  }
}

function toggleExpand(parentRow: any) {
  const api = gridApi.value
  if (!api) return

  const allRows: any[] = []
  api.forEachNode((node) => {
    if (node.data) allRows.push(node.data)
  })

  const parentIndex = allRows.findIndex((r) => r.id === parentRow.id && !r._isDetail)
  if (parentIndex === -1) return

  const newData: any[] = [...allRows]

  if (newData[parentIndex]._expanded) {
    newData[parentIndex] = { ...newData[parentIndex], _expanded: false }
    let removeCount = 0
    for (let i = parentIndex + 1; i < newData.length; i++) {
      if (newData[i]._isDetail && newData[i]._parentId === parentRow.id) {
        removeCount++
      } else {
        break
      }
    }
    newData.splice(parentIndex + 1, removeCount)
  } else {
    newData[parentIndex] = { ...newData[parentIndex], _expanded: true }
    const originalRow = masterData.find((r) => r.id === parentRow.id)
    if (!originalRow) return
    const detailRows = originalRow.sources.map((source: SourceBreakdown, i: number) => ({
      id: -(parentRow.id * 100 + i + 1),
      date: `  \u21B3 ${source.source}`,
      totalRevenue: source.revenue,
      totalSpend: source.spend,
      profit: source.profit,
      transactions: source.installs,
      sources: [],
      _isDetail: true,
      _parentId: parentRow.id,
    }))
    newData.splice(parentIndex + 1, 0, ...detailRows)
  }

  api.setGridOption('rowData', newData)
}

onMounted(() => {
  gridWrapper.value?.addEventListener('grid-action', handleGridAction)
})

onUnmounted(() => {
  gridWrapper.value?.removeEventListener('grid-action', handleGridAction)
})
</script>

<template>
  <div>
    <PageHeader
      title="Daily Revenue — Expandable Rows & Popups"
      description="Click ▶ to expand rows, 'Details' for popup. Two event patterns: onCellClicked for expand, CustomEvent bubbling for action buttons."
      badge="Pain Point #2"
    />

    <n-alert type="info" style="margin-bottom: 12px">
      <strong>Expand:</strong> uses <code>onCellClicked</code> grid event — simplest approach, no custom renderer needed.
      <strong>Details popup:</strong> JS cell renderer dispatches <code>CustomEvent</code> with <code>bubbles: true</code> — for complex interactions.
    </n-alert>

    <div ref="gridWrapper" :class="currentTheme" style="height: calc(100vh - 240px)">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :getRowClass="getRowClass"
        :animateRows="true"
        :pagination="true"
        :paginationPageSize="50"
        :paginationPageSizeSelector="[25, 50, 100]"
        @grid-ready="onGridReady"
        @cell-clicked="onCellClicked"
      />
    </div>

    <n-modal v-model:show="showPopup" preset="card" title="Revenue Details" style="max-width: 600px">
      <template v-if="popupData">
        <div class="popup-summary">
          <div class="popup-row">
            <span class="popup-label">Date</span>
            <span class="popup-value">{{ popupData.date }}</span>
          </div>
          <div class="popup-row">
            <span class="popup-label">Revenue</span>
            <span class="popup-value">${{ popupData.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</span>
          </div>
          <div class="popup-row">
            <span class="popup-label">Spend</span>
            <span class="popup-value">${{ popupData.totalSpend?.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</span>
          </div>
          <div class="popup-row">
            <span class="popup-label">Profit</span>
            <span class="popup-value" :style="{ color: (popupData.profit ?? 0) >= 0 ? '#16a34a' : '#dc2626' }">
              ${{ Math.abs(popupData.profit ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
            </span>
          </div>
        </div>

        <n-divider>Source Breakdown</n-divider>

        <n-data-table
          :columns="[
            { title: 'Source', key: 'source' },
            { title: 'Revenue', key: 'revenue', render: (row: any) => `$${row.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
            { title: 'Spend', key: 'spend', render: (row: any) => `$${row.spend.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
            { title: 'Profit', key: 'profit', render: (row: any) => `$${row.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
            { title: 'Installs', key: 'installs', render: (row: any) => row.installs.toLocaleString() },
          ]"
          :data="popupData.sources"
          :bordered="false"
          size="small"
        />
      </template>
    </n-modal>
  </div>
</template>

<style scoped>
.popup-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.popup-row {
  display: flex;
  flex-direction: column;
}

.popup-label {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.popup-value {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}
</style>
