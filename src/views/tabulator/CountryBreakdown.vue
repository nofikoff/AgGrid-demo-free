<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import 'tabulator-tables/dist/css/tabulator_modern.min.css'
import { getCountryData } from '../../data/cache'
import { currencyFormatter } from '../../renderers/tabulator/currencyFormatter'
import { profitFormatter } from '../../renderers/tabulator/profitFormatter'
import { sparklineFormatter } from '../../renderers/tabulator/sparklineFormatter'
import { numberFormatter } from '../../renderers/tabulator/numberFormatter'
import PageHeader from '../../components/PageHeader.vue'

const tableRef = ref<HTMLDivElement>()
let table: Tabulator | null = null

onMounted(() => {
  if (!tableRef.value) return

  table = new Tabulator(tableRef.value, {
    data: getCountryData(),
    height: 'calc(100vh - 160px)',
    layout: 'fitColumns',
    initialSort: [{ column: 'revenue', dir: 'desc' }],
    columns: [
      {
        title: 'Country',
        field: 'country',
        minWidth: 200,
        frozen: true,
        formatter(cell) {
          const data = cell.getData()
          return `${data.flagEmoji} ${cell.getValue()}`
        },
      },
      { title: 'Clicks', field: 'clicks', formatter: numberFormatter, width: 130, hozAlign: 'right' },
      { title: 'Installs', field: 'installs', formatter: numberFormatter, width: 120, hozAlign: 'right' },
      { title: 'Revenue', field: 'revenue', formatter: currencyFormatter, width: 140, hozAlign: 'right' },
      { title: 'Spend', field: 'spend', formatter: currencyFormatter, width: 130, hozAlign: 'right' },
      { title: 'Profit', field: 'profit', formatter: profitFormatter, width: 160, hozAlign: 'right' },
      { title: 'DAU', field: 'dau', formatter: numberFormatter, width: 130, hozAlign: 'right' },
      { title: 'Revenue Trend (30d)', field: 'revenueHistory', formatter: sparklineFormatter, width: 180, headerSort: false },
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
      title="Country Breakdown"
      description="Canvas-based sparkline charts in Tabulator cells. Each sparkline is a lightweight 140x28 canvas drawn with plain JS."
      badge="Canvas Sparklines"
    />

    <div ref="tableRef" />
  </div>
</template>
