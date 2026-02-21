<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import type { CellComponent, RowComponent } from 'tabulator-tables'
import 'tabulator-tables/dist/css/tabulator_modern.min.css'
import { getDailyRevenueData } from '../../data/cache'
import type { DailyRevenueRow, SourceBreakdown } from '../../types/adtech'
import { currencyFormatter } from '../../renderers/tabulator/currencyFormatter'
import { profitFormatter } from '../../renderers/tabulator/profitFormatter'
import { numberFormatter } from '../../renderers/tabulator/numberFormatter'
import PageHeader from '../../components/PageHeader.vue'

const tableRef = ref<HTMLDivElement>()
const showPopup = ref(false)
const popupData = ref<DailyRevenueRow | null>(null)
let table: Tabulator | null = null
let masterData: DailyRevenueRow[] = []
let currentData: any[] = []

function buildFlatData(): any[] {
  return masterData.map((r) => ({ ...r }))
}

function toggleExpand(row: RowComponent) {
  const data = row.getData()
  if (data._isDetail) return

  const parentId = data.id
  const parentIdx = currentData.findIndex((r) => r.id === parentId && !r._isDetail)
  if (parentIdx === -1) return

  if (currentData[parentIdx]._expanded) {
    currentData[parentIdx] = { ...currentData[parentIdx], _expanded: false }
    let removeCount = 0
    for (let i = parentIdx + 1; i < currentData.length; i++) {
      if (currentData[i]._isDetail && currentData[i]._parentId === parentId) {
        removeCount++
      } else {
        break
      }
    }
    currentData.splice(parentIdx + 1, removeCount)
  } else {
    currentData[parentIdx] = { ...currentData[parentIdx], _expanded: true }
    const original = masterData.find((r) => r.id === parentId)
    if (!original) return
    const detailRows = original.sources.map((source: SourceBreakdown, i: number) => ({
      id: -(parentId * 100 + i + 1),
      date: `  \u21B3 ${source.source}`,
      totalRevenue: source.revenue,
      totalSpend: source.spend,
      profit: source.profit,
      transactions: source.installs,
      sources: [],
      _isDetail: true,
      _parentId: parentId,
      _expanded: false,
    }))
    currentData.splice(parentIdx + 1, 0, ...detailRows)
  }

  table?.replaceData([...currentData])
}

onMounted(() => {
  if (!tableRef.value) return
  masterData = getDailyRevenueData().map((r) => ({ ...r }))
  currentData = buildFlatData()

  table = new Tabulator(tableRef.value, {
    data: [...currentData],
    height: 'calc(100vh - 240px)',
    layout: 'fitColumns',
    pagination: true,
    paginationSize: 50,
    paginationSizeSelector: [25, 50, 100],
    index: 'id',
    rowFormatter(row: RowComponent) {
      if (row.getData()?._isDetail) {
        row.getElement().style.background = '#f8fafc'
        row.getElement().style.fontSize = '13px'
      }
    },
    columns: [
      {
        title: '',
        field: '_expand',
        width: 60,
        headerSort: false,
        resizable: false,
        hozAlign: 'center',
        formatter(cell: CellComponent) {
          const data = cell.getData()
          if (data._isDetail) return ''
          return data._expanded ? '\u25BC' : '\u25B6'
        },
        cellClick(_e: Event, cell: CellComponent) {
          const data = cell.getData()
          if (!data._isDetail) {
            toggleExpand(cell.getRow())
          }
        },
      },
      { title: 'Date', field: 'date', minWidth: 200 },
      { title: 'Revenue', field: 'totalRevenue', formatter: currencyFormatter, width: 140, hozAlign: 'right' },
      { title: 'Spend', field: 'totalSpend', formatter: currencyFormatter, width: 130, hozAlign: 'right' },
      { title: 'Profit', field: 'profit', formatter: profitFormatter, width: 160, hozAlign: 'right' },
      { title: 'Transactions', field: 'transactions', formatter: numberFormatter, width: 130, hozAlign: 'right' },
      {
        title: 'Actions',
        field: 'actions',
        width: 100,
        headerSort: false,
        hozAlign: 'center',
        formatter(cell: CellComponent) {
          if (cell.getData()._isDetail) return ''
          const btn = document.createElement('button')
          btn.textContent = 'Details'
          btn.className = 'ag-action-btn'
          return btn
        },
        cellClick(_e: Event, cell: CellComponent) {
          const data = cell.getData()
          if (!data._isDetail) {
            const original = masterData.find((r) => r.id === data.id)
            if (original) {
              popupData.value = original
              showPopup.value = true
            }
          }
        },
      },
    ],
  })
})

onUnmounted(() => {
  table?.destroy()
  table = null
})
</script>

<template>
  <div>
    <PageHeader
      title="Daily Revenue — Expandable Rows & Popups"
      description="Click ▶ to expand rows, 'Details' for popup. Tabulator uses replaceData() for expand/collapse."
      badge="Expandable Rows"
    />

    <n-alert type="info" style="margin-bottom: 12px">
      <strong>Expand:</strong> uses Tabulator <code>cellClick</code> event.
      <strong>Details popup:</strong> same cellClick on Actions column opens Naive UI modal.
    </n-alert>

    <div ref="tableRef" />

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
