<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { getDragData } from '../../data/cache'
import { formatCurrency } from '../../formatters/currency'
import PageHeader from '../../components/PageHeader.vue'

const data = ref<any[]>([])
const saved = ref(false)

onMounted(() => {
  data.value = getDragData().map((r, i) => ({ ...r, priority: i + 1 }))
})

function onRowReorder(event: any) {
  data.value = event.value.map((row: any, index: number) => ({
    ...row,
    priority: index + 1,
  }))
  saved.value = false
}

function saveOrder() {
  data.value = data.value.map((row, index) => ({
    ...row,
    priority: index + 1,
  }))
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}

function statusClass(status: string): string {
  return `status-${status}`
}
</script>

<template>
  <div>
    <PageHeader
      title="Drag & Drop Priority"
      description="Drag rows to reorder campaign priority. PrimeVue's built-in rowReorder column."
    />

    <div class="toolbar">
      <n-button type="primary" @click="saveOrder">Save Order</n-button>
      <n-tag v-if="saved" type="success" round>Saved!</n-tag>
    </div>

    <DataTable
      :value="data"
      :scrollHeight="'calc(100vh - 200px)'"
      scrollable
      @row-reorder="onRowReorder"
      class="p-datatable-sm"
    >
      <Column :rowReorder="true" :style="{ width: '60px' }" />
      <Column field="priority" header="#" :style="{ width: '80px', textAlign: 'center' }">
        <template #body="{ index }">{{ index + 1 }}</template>
      </Column>
      <Column field="campaignName" header="Campaign" :style="{ minWidth: '250px' }" />
      <Column field="status" header="Status" :style="{ width: '110px' }">
        <template #body="{ data: row }">
          <span :class="statusClass(row.status)">
            {{ row.status.charAt(0).toUpperCase() + row.status.slice(1) }}
          </span>
        </template>
      </Column>
      <Column field="dailyBudget" header="Daily Budget" :style="{ minWidth: '140px' }">
        <template #body="{ data: row }">{{ formatCurrency(row.dailyBudget) }}</template>
      </Column>
      <Column field="spend" header="Spend" :style="{ minWidth: '120px' }">
        <template #body="{ data: row }">{{ formatCurrency(row.spend) }}</template>
      </Column>
      <Column field="installs" header="Installs" :style="{ minWidth: '110px' }">
        <template #body="{ data: row }">{{ row.installs?.toLocaleString() }}</template>
      </Column>
      <Column field="cpi" header="CPI" :style="{ minWidth: '100px' }">
        <template #body="{ data: row }">{{ formatCurrency(row.cpi) }}</template>
      </Column>
    </DataTable>
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
