<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { getCountryData } from '../../data/cache'
import { formatCurrency } from '../../formatters/currency'
import { formatProfit } from '../../formatters/profit'
import SparklineCell from '../../components/SparklineCell.vue'
import PageHeader from '../../components/PageHeader.vue'

const data = ref<any[]>([])

onMounted(() => {
  data.value = getCountryData()
})
</script>

<template>
  <div>
    <PageHeader
      title="Country Breakdown"
      description="Canvas-based sparkline charts in PrimeVue scoped slots. Each sparkline is a Vue component wrapping a 140x28 canvas."
      badge="Canvas Sparklines"
    />

    <DataTable
      :value="data"
      :scrollHeight="'calc(100vh - 160px)'"
      scrollable
      sortField="revenue"
      :sortOrder="-1"
      class="p-datatable-sm"
    >
      <Column field="country" header="Country" :style="{ minWidth: '200px' }" frozen sortable>
        <template #body="{ data: row }">{{ row.flagEmoji }} {{ row.country }}</template>
      </Column>
      <Column field="clicks" header="Clicks" :style="{ minWidth: '130px' }" sortable>
        <template #body="{ data: row }">{{ row.clicks?.toLocaleString() }}</template>
      </Column>
      <Column field="installs" header="Installs" :style="{ minWidth: '120px' }" sortable>
        <template #body="{ data: row }">{{ row.installs?.toLocaleString() }}</template>
      </Column>
      <Column field="revenue" header="Revenue" :style="{ minWidth: '140px' }" sortable>
        <template #body="{ data: row }">{{ formatCurrency(row.revenue) }}</template>
      </Column>
      <Column field="spend" header="Spend" :style="{ minWidth: '130px' }" sortable>
        <template #body="{ data: row }">{{ formatCurrency(row.spend) }}</template>
      </Column>
      <Column field="profit" header="Profit" :style="{ minWidth: '160px' }" sortable>
        <template #body="{ data: row }">
          <span :style="{ fontWeight: 600, color: formatProfit(row.profit).color }">
            {{ formatProfit(row.profit).text }}
          </span>
        </template>
      </Column>
      <Column field="dau" header="DAU" :style="{ minWidth: '130px' }" sortable>
        <template #body="{ data: row }">{{ row.dau?.toLocaleString() }}</template>
      </Column>
      <Column field="revenueHistory" header="Revenue Trend (30d)" :style="{ minWidth: '180px' }" :sortable="false">
        <template #body="{ data: row }">
          <SparklineCell :data="row.revenueHistory" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
