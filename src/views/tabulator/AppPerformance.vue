<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import 'tabulator-tables/dist/css/tabulator_modern.min.css'
import { getAppData } from '../../data/cache'
import { currencyFormatter } from '../../renderers/tabulator/currencyFormatter'
import { percentFormatter } from '../../renderers/tabulator/percentFormatter'
import { numberFormatter } from '../../renderers/tabulator/numberFormatter'
import { usePerformanceMetrics } from '../../composables/usePerformanceMetrics'
import PageHeader from '../../components/PageHeader.vue'
import PerformancePanel from '../../components/PerformancePanel.vue'

const { fps, renderTime, rowCount, startMeasuring, recordRenderTime, setRowCount } =
  usePerformanceMetrics()

const tableRef = ref<HTMLDivElement>()
let table: Tabulator | null = null

onMounted(() => {
  if (!tableRef.value) return
  const start = performance.now()
  const data = getAppData(50_000)

  table = new Tabulator(tableRef.value, {
    data,
    height: 'calc(100vh - 220px)',
    layout: 'fitColumns',
    pagination: true,
    paginationSize: 100,
    paginationSizeSelector: [50, 100, 500],
    selectable: true,
    placeholder: 'No Data Available',
    columns: [
      {
        title: 'Select',
        formatter: 'rowSelection',
        titleFormatter: 'rowSelection',
        width: 60,
        hozAlign: 'center',
        headerSort: false,
        resizable: false,
      },
      { title: 'App', field: 'appName', minWidth: 180 },
      { title: 'Bundle ID', field: 'bundleId', width: 200 },
      { title: 'Category', field: 'category', width: 140 },
      { title: 'Installs', field: 'installs', formatter: numberFormatter, width: 120, hozAlign: 'right' },
      { title: 'Revenue', field: 'revenue', formatter: currencyFormatter, width: 130, hozAlign: 'right' },
      { title: 'DAU', field: 'dau', formatter: numberFormatter, width: 110, hozAlign: 'right' },
      { title: 'D1 Ret.', field: 'retentionD1', formatter: percentFormatter, width: 100, hozAlign: 'right' },
      { title: 'D7 Ret.', field: 'retentionD7', formatter: percentFormatter, width: 100, hozAlign: 'right' },
    ],
  })

  let rendered = false
  table.on('renderComplete', () => {
    if (!rendered) {
      rendered = true
      recordRenderTime(start)
    }
  })

  setRowCount(data.length)
  startMeasuring()
})

onUnmounted(() => {
  table?.destroy()
  table = null
})
</script>

<template>
  <div>
    <PageHeader
      title="App Performance"
      description="50,000 rows with Tabulator built-in row selection. Single mode — no A/B test needed, Tabulator handles checkbox natively."
    />

    <div class="controls">
      <PerformancePanel :fps="fps" :render-time="renderTime" :row-count="rowCount" />
    </div>

    <div ref="tableRef" />
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
