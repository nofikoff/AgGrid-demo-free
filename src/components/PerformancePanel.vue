<script setup lang="ts">
defineProps<{
  fps: number
  renderTime: number
  rowCount: number
  label?: string
}>()
</script>

<template>
  <div class="perf-panel">
    <span v-if="label" class="perf-label">{{ label }}</span>
    <div class="perf-stat">
      <span class="perf-value">{{ rowCount.toLocaleString() }}</span>
      <span class="perf-title">Rows</span>
    </div>
    <div class="perf-stat">
      <span class="perf-value" :class="{ 'perf-warn': fps > 0 && fps < 30 }">{{ fps }}</span>
      <span class="perf-title">FPS</span>
    </div>
    <div class="perf-stat">
      <span class="perf-value">{{ renderTime }}ms</span>
      <span class="perf-title">Render</span>
    </div>
  </div>
</template>

<style scoped>
.perf-panel {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 8px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
}

.perf-label {
  font-weight: 600;
  color: #475569;
}

.perf-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.perf-value {
  font-weight: 700;
  font-size: 15px;
  color: #1e293b;
  font-variant-numeric: tabular-nums;
}

.perf-value.perf-warn {
  color: #dc2626;
}

.perf-title {
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
