<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import 'tabulator-tables/dist/css/tabulator_modern.min.css'
import { getCampaignData } from '../../data/cache'
import { currencyFormatter } from '../../renderers/tabulator/currencyFormatter'
import { percentFormatter } from '../../renderers/tabulator/percentFormatter'
import { profitFormatter } from '../../renderers/tabulator/profitFormatter'
import { flagFormatter } from '../../renderers/tabulator/flagFormatter'
import { numberFormatter } from '../../renderers/tabulator/numberFormatter'
import { usePerformanceMetrics } from '../../composables/usePerformanceMetrics'
import PageHeader from '../../components/PageHeader.vue'
import PerformancePanel from '../../components/PerformancePanel.vue'

const { fps, renderTime, rowCount, startMeasuring, recordRenderTime, setRowCount } =
  usePerformanceMetrics()

const tableRef = ref<HTMLDivElement>()
const quickFilter = ref('')
let table: Tabulator | null = null

onMounted(() => {
  if (!tableRef.value) return
  const start = performance.now()
  const data = getCampaignData(100_000)

  table = new Tabulator(tableRef.value, {
    data,
    height: 'calc(100vh - 200px)',
    layout: 'fitColumns',
    pagination: true,
    paginationSize: 100,
    paginationSizeSelector: [50, 100, 500, 1000],
    placeholder: 'No Data Available',
    columns: [
      { title: 'Campaign', field: 'campaignName', minWidth: 280, frozen: true, headerFilter: true },
      { title: 'Advertiser', field: 'advertiser', width: 160 },
      { title: 'Country', field: 'country', formatter: flagFormatter, width: 180 },
      { title: 'App', field: 'appName', width: 160 },
      { title: 'Category', field: 'category', width: 130 },
      { title: 'Month', field: 'month', width: 100 },
      { title: 'Impressions', field: 'impressions', formatter: numberFormatter, width: 130, hozAlign: 'right' },
      { title: 'Clicks', field: 'clicks', formatter: numberFormatter, width: 110, hozAlign: 'right' },
      { title: 'CTR', field: 'ctr', formatter: percentFormatter, width: 100, hozAlign: 'right' },
      { title: 'Installs', field: 'installs', formatter: numberFormatter, width: 110, hozAlign: 'right' },
      { title: 'CPI', field: 'cpi', formatter: currencyFormatter, width: 100, hozAlign: 'right' },
      { title: 'Revenue', field: 'revenue', formatter: currencyFormatter, width: 130, hozAlign: 'right' },
      { title: 'Spend', field: 'spend', formatter: currencyFormatter, width: 130, hozAlign: 'right' },
      { title: 'Profit', field: 'profit', formatter: profitFormatter, width: 150, hozAlign: 'right' },
      { title: 'ROI', field: 'roi', formatter: percentFormatter, width: 100, hozAlign: 'right' },
      { title: 'DAU', field: 'dau', formatter: numberFormatter, width: 120, hozAlign: 'right' },
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

function onFilterChange() {
  if (!table) return
  if (quickFilter.value) {
    table.setFilter((data: any) => {
      const q = quickFilter.value.toLowerCase()
      return (
        data.campaignName?.toLowerCase().includes(q) ||
        data.advertiser?.toLowerCase().includes(q) ||
        data.country?.toLowerCase().includes(q) ||
        data.appName?.toLowerCase().includes(q)
      )
    })
  } else {
    table.clearFilter(true)
  }
}
</script>

<template>
  <div>
    <PageHeader
      title="Campaign Report"
      description="100,000 rows with Tabulator custom formatters, client-side pagination & sorting."
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

    <div ref="tableRef" />
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
