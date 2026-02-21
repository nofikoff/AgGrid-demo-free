<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { getAppData } from '../../data/cache'
import { formatCurrency } from '../../formatters/currency'
import { formatPercent } from '../../formatters/percent'
import { usePerformanceMetrics } from '../../composables/usePerformanceMetrics'
import PageHeader from '../../components/PageHeader.vue'
import PerformancePanel from '../../components/PerformancePanel.vue'

const { fps, renderTime, rowCount, startMeasuring, recordRenderTime, setRowCount } =
  usePerformanceMetrics()

const data = ref<any[]>([])
const selectedRows = ref<any[]>([])

onMounted(() => {
  const start = performance.now()
  const rows = getAppData(50_000)
  data.value = rows
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
</script>

<template>
  <div>
    <PageHeader
      title="App Performance"
      description="50,000 rows with PrimeVue virtual scroll and built-in checkbox selection. Single mode — PrimeVue handles selection natively."
    />

    <div class="controls">
      <PerformancePanel :fps="fps" :render-time="renderTime" :row-count="rowCount" />
    </div>

    <DataTable
      v-model:selection="selectedRows"
      :value="data"
      scrollable
      :scrollHeight="'calc(100vh - 220px)'"
      :virtualScrollerOptions="{ itemSize: 36 }"
      dataKey="id"
      class="p-datatable-sm"
    >
      <Column selectionMode="multiple" :style="{ width: '60px' }" />
      <Column field="appName" header="App" :style="{ minWidth: '180px' }" sortable />
      <Column field="bundleId" header="Bundle ID" :style="{ minWidth: '200px' }" sortable />
      <Column field="category" header="Category" :style="{ minWidth: '140px' }" sortable />
      <Column field="installs" header="Installs" :style="{ minWidth: '120px' }" sortable>
        <template #body="{ data: row }">{{ row.installs?.toLocaleString() }}</template>
      </Column>
      <Column field="revenue" header="Revenue" :style="{ minWidth: '130px' }" sortable>
        <template #body="{ data: row }">{{ formatCurrency(row.revenue) }}</template>
      </Column>
      <Column field="dau" header="DAU" :style="{ minWidth: '110px' }" sortable>
        <template #body="{ data: row }">{{ row.dau?.toLocaleString() }}</template>
      </Column>
      <Column field="retentionD1" header="D1 Ret." :style="{ minWidth: '100px' }" sortable>
        <template #body="{ data: row }">
          <span :style="{ color: formatPercent(row.retentionD1).color }">{{ formatPercent(row.retentionD1).text }}</span>
        </template>
      </Column>
      <Column field="retentionD7" header="D7 Ret." :style="{ minWidth: '100px' }" sortable>
        <template #body="{ data: row }">
          <span :style="{ color: formatPercent(row.retentionD7).color }">{{ formatPercent(row.retentionD7).text }}</span>
        </template>
      </Column>
    </DataTable>
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
