<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { getDailyRevenueData } from '../../data/cache'
import type { DailyRevenueRow } from '../../types/adtech'
import { formatCurrency } from '../../formatters/currency'
import { formatProfit } from '../../formatters/profit'
import PageHeader from '../../components/PageHeader.vue'

const data = ref<DailyRevenueRow[]>([])
const expandedRows = ref<Record<string, boolean>>({})
const showPopup = ref(false)
const popupData = ref<DailyRevenueRow | null>(null)

onMounted(() => {
  data.value = getDailyRevenueData()
})

function showDetails(row: DailyRevenueRow) {
  popupData.value = row
  showPopup.value = true
}
</script>

<template>
  <div>
    <PageHeader
      title="Daily Revenue — Expandable Rows & Popups"
      description="Click row expander for source breakdown, 'Details' for popup. PrimeVue native expandedRows v-model."
      badge="Expandable Rows"
    />

    <n-alert type="info" style="margin-bottom: 12px">
      <strong>Expand:</strong> PrimeVue's built-in row expansion via <code>expandedRows</code> v-model.
      <strong>Details popup:</strong> button click opens Naive UI modal.
    </n-alert>

    <DataTable
      v-model:expandedRows="expandedRows"
      :value="data"
      dataKey="id"
      scrollable
      :scrollHeight="'calc(100vh - 260px)'"
      :paginator="true"
      :rows="50"
      :rowsPerPageOptions="[25, 50, 100]"
      class="p-datatable-sm"
    >
      <Column expander :style="{ width: '60px' }" />
      <Column field="date" header="Date" :style="{ minWidth: '200px' }" sortable />
      <Column field="totalRevenue" header="Revenue" :style="{ minWidth: '140px' }" sortable>
        <template #body="{ data: row }">{{ formatCurrency(row.totalRevenue) }}</template>
      </Column>
      <Column field="totalSpend" header="Spend" :style="{ minWidth: '130px' }" sortable>
        <template #body="{ data: row }">{{ formatCurrency(row.totalSpend) }}</template>
      </Column>
      <Column field="profit" header="Profit" :style="{ minWidth: '160px' }" sortable>
        <template #body="{ data: row }">
          <span :style="{ fontWeight: 600, color: formatProfit(row.profit).color }">
            {{ formatProfit(row.profit).text }}
          </span>
        </template>
      </Column>
      <Column field="transactions" header="Transactions" :style="{ minWidth: '130px' }" sortable>
        <template #body="{ data: row }">{{ row.transactions?.toLocaleString() }}</template>
      </Column>
      <Column header="Actions" :style="{ width: '100px' }">
        <template #body="{ data: row }">
          <button class="ag-action-btn" @click="showDetails(row)">Details</button>
        </template>
      </Column>

      <template #expansion="{ data: row }">
        <div style="padding: 8px 16px">
          <h4 style="margin-bottom: 8px; font-size: 14px; color: #64748b">Source Breakdown</h4>
          <DataTable :value="row.sources" class="p-datatable-sm">
            <Column field="source" header="Source" />
            <Column field="revenue" header="Revenue">
              <template #body="{ data: s }">{{ formatCurrency(s.revenue) }}</template>
            </Column>
            <Column field="spend" header="Spend">
              <template #body="{ data: s }">{{ formatCurrency(s.spend) }}</template>
            </Column>
            <Column field="profit" header="Profit">
              <template #body="{ data: s }">
                <span :style="{ fontWeight: 600, color: formatProfit(s.profit).color }">
                  {{ formatProfit(s.profit).text }}
                </span>
              </template>
            </Column>
            <Column field="installs" header="Installs">
              <template #body="{ data: s }">{{ s.installs?.toLocaleString() }}</template>
            </Column>
          </DataTable>
        </div>
      </template>
    </DataTable>

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
