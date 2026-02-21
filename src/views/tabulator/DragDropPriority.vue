<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import type { RowComponent } from 'tabulator-tables'
import 'tabulator-tables/dist/css/tabulator_modern.min.css'
import { getDragData } from '../../data/cache'
import { currencyFormatter } from '../../renderers/tabulator/currencyFormatter'
import { statusFormatter } from '../../renderers/tabulator/statusFormatter'
import { numberFormatter } from '../../renderers/tabulator/numberFormatter'
import PageHeader from '../../components/PageHeader.vue'

const tableRef = ref<HTMLDivElement>()
const saved = ref(false)
let table: Tabulator | null = null

onMounted(() => {
  if (!tableRef.value) return

  table = new Tabulator(tableRef.value, {
    data: getDragData().map((r, i) => ({ ...r, priority: i + 1 })),
    height: 'calc(100vh - 200px)',
    layout: 'fitColumns',
    movableRows: true,
    index: 'id',
    columns: [
      {
        title: '#',
        field: 'priority',
        width: 80,
        rowHandle: true,
        formatter(cell) {
          return String(cell.getRow().getPosition())
        },
        hozAlign: 'center',
        headerSort: false,
      },
      { title: 'Campaign', field: 'campaignName', minWidth: 250 },
      { title: 'Status', field: 'status', formatter: statusFormatter, width: 110 },
      { title: 'Daily Budget', field: 'dailyBudget', formatter: currencyFormatter, width: 140, hozAlign: 'right' },
      { title: 'Spend', field: 'spend', formatter: currencyFormatter, width: 120, hozAlign: 'right' },
      { title: 'Installs', field: 'installs', formatter: numberFormatter, width: 110, hozAlign: 'right' },
      { title: 'CPI', field: 'cpi', formatter: currencyFormatter, width: 100, hozAlign: 'right' },
    ],
  })

  table.on('rowMoved', () => {
    saved.value = false
    table?.getRows().forEach((row: RowComponent) => {
      row.reformat()
    })
  })
})

onUnmounted(() => {
  table?.destroy()
  table = null
})

function saveOrder() {
  if (!table) return
  const rows = table.getRows()
  const newData = rows.map((row: RowComponent, index: number) => ({
    ...row.getData(),
    priority: index + 1,
  }))
  table.replaceData(newData)
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}
</script>

<template>
  <div>
    <PageHeader
      title="Drag & Drop Priority"
      description="Drag rows to reorder campaign priority. Tabulator's movableRows feature — built-in, no extra plugins needed."
    />

    <div class="toolbar">
      <n-button type="primary" @click="saveOrder">Save Order</n-button>
      <n-tag v-if="saved" type="success" round>Saved!</n-tag>
    </div>

    <div ref="tableRef" />
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
