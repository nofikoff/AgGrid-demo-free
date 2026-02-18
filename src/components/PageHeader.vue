<script setup lang="ts">
defineProps<{
  title: string
  description: string
  badge?: string
}>()
</script>

<template>
  <div class="page-header">
    <div class="page-header-top">
      <h1>{{ title }}</h1>
      <n-tag v-if="badge" type="warning" size="small" round>{{ badge }}</n-tag>
    </div>
    <p class="page-desc">{{ description }}</p>
    <slot />
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 16px;
}

.page-header-top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-header h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
}

.page-desc {
  margin: 4px 0 0;
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
}
</style>
