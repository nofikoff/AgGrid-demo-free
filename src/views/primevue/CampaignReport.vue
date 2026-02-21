<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { getCampaignData } from '../../data/cache'
import { formatCurrency } from '../../formatters/currency'
import { formatPercent } from '../../formatters/percent'
import { formatProfit } from '../../formatters/profit'
import { COUNTRIES } from '../../data/constants'
import { usePerformanceMetrics } from '../../composables/usePerformanceMetrics'
import PageHeader from '../../components/PageHeader.vue'
import PerformancePanel from '../../components/PerformancePanel.vue'

const countryMap = new Map(COUNTRIES.map((c) => [c.code, c]))

const { fps, renderTime, rowCount, startMeasuring, recordRenderTime, setRowCount } =
  usePerformanceMetrics()

const data = ref<any[]>([])
const globalFilter = ref('')
const filteredData = ref<any[]>([])

onMounted(() => {
  const start = performance.now()
  const rows = getCampaignData(100_000)
  data.value = rows
  filteredData.value = rows
  setRowCount(rows.length)
  startMeasuring()
  nextTick(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        recordRenderTime(start)
      })
    })
  })
})

function onFilter() {
  if (!globalFilter.value) {
    filteredData.value = data.value
    return
  }
  const q = globalFilter.value.toLowerCase()
  filteredData.value = data.value.filter(
    (r) =>
      r.campaignName?.toLowerCase().includes(q) ||
      r.advertiser?.toLowerCase().includes(q) ||
      r.country?.toLowerCase().includes(q) ||
      r.appName?.toLowerCase().includes(q),
  )
}

function flagText(row: any): string {
  const info = countryMap.get(row.countryCode)
  return info ? `${info.flag} ${info.name}` : row.country
}
</script>

<template>
  <div>
    <PageHeader
      title="Campaign Report"
      description="100,000 rows with PrimeVue virtual scroll, scoped slot formatters & global filter."
    />

    <div class="toolbar">
      <n-input
        v-model:value="globalFilter"
        placeholder="Quick filter..."
        clearable
        style="width: 300px"
        @update:value="onFilter"
      />
      <PerformancePanel :fps="fps" :render-time="renderTime" :row-count="rowCount" />
    </div>

    <DataTable
      :value="filteredData"
      scrollable
      :scrollHeight="'calc(100vh - 200px)'"
      :virtualScrollerOptions="{ itemSize: 36 }"
      :sortMode="'single'"
      class="p-datatable-sm"
    >
      <Column field="campaignName" header="Campaign" :style="{ minWidth: '280px' }" frozen sortable />
      <Column field="advertiser" header="Advertiser" :style="{ minWidth: '160px' }" sortable />
      <Column field="country" header="Country" :style="{ minWidth: '180px' }" sortable>
        <template #body="{ data: row }">{{ flagText(row) }}</template>
      </Column>
      <Column field="appName" header="App" :style="{ minWidth: '160px' }" sortable />
      <Column field="category" header="Category" :style="{ minWidth: '130px' }" sortable />
      <Column field="month" header="Month" :style="{ minWidth: '100px' }" sortable />
      <Column field="impressions" header="Impressions" :style="{ minWidth: '130px' }" sortable>
        <template #body="{ data: row }">{{ row.impressions?.toLocaleString() }}</template>
      </Column>
      <Column field="clicks" header="Clicks" :style="{ minWidth: '110px' }" sortable>
        <template #body="{ data: row }">{{ row.clicks?.toLocaleString() }}</template>
      </Column>
      <Column field="ctr" header="CTR" :style="{ minWidth: '100px' }" sortable>
        <template #body="{ data: row }">
          <span :style="{ color: formatPercent(row.ctr).color }">{{ formatPercent(row.ctr).text }}</span>
        </template>
      </Column>
      <Column field="installs" header="Installs" :style="{ minWidth: '110px' }" sortable>
        <template #body="{ data: row }">{{ row.installs?.toLocaleString() }}</template>
      </Column>
      <Column field="cpi" header="CPI" :style="{ minWidth: '100px' }" sortable>
        <template #body="{ data: row }">{{ formatCurrency(row.cpi) }}</template>
      </Column>
      <Column field="revenue" header="Revenue" :style="{ minWidth: '130px' }" sortable>
        <template #body="{ data: row }">{{ formatCurrency(row.revenue) }}</template>
      </Column>
      <Column field="spend" header="Spend" :style="{ minWidth: '130px' }" sortable>
        <template #body="{ data: row }">{{ formatCurrency(row.spend) }}</template>
      </Column>
      <Column field="profit" header="Profit" :style="{ minWidth: '150px' }" sortable>
        <template #body="{ data: row }">
          <span :style="{ fontWeight: 600, color: formatProfit(row.profit).color }">
            {{ formatProfit(row.profit).text }}
          </span>
        </template>
      </Column>
      <Column field="roi" header="ROI" :style="{ minWidth: '100px' }" sortable>
        <template #body="{ data: row }">
          <span :style="{ color: formatPercent(row.roi).color }">{{ formatPercent(row.roi).text }}</span>
        </template>
      </Column>
      <Column field="dau" header="DAU" :style="{ minWidth: '120px' }" sortable>
        <template #body="{ data: row }">{{ row.dau?.toLocaleString() }}</template>
      </Column>
    </DataTable>
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
