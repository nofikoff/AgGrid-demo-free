<script setup lang="ts">
import { h, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NMenu } from 'naive-ui'
import type { MenuOption } from 'naive-ui'

const router = useRouter()
const route = useRoute()

function renderIcon(emoji: string) {
  return () => h('span', { style: 'font-size: 16px' }, emoji)
}

const menuOptions: MenuOption[] = [
  {
    label: 'Campaign Report',
    key: '/campaign-report',
    icon: renderIcon('📊'),
  },
  {
    label: 'Country Breakdown',
    key: '/country-breakdown',
    icon: renderIcon('🌍'),
  },
  {
    label: 'App Performance',
    key: '/app-performance',
    icon: renderIcon('⚡'),
  },
  {
    label: 'Daily Revenue',
    key: '/daily-revenue',
    icon: renderIcon('📅'),
  },
  {
    label: 'Drag & Drop',
    key: '/drag-drop',
    icon: renderIcon('↕️'),
  },
]

const activeKey = computed(() => route.path)

function handleSelect(key: string) {
  router.push(key)
}
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-logo">
      <span class="logo-icon">📈</span>
      <span class="logo-text">AdTech Grid</span>
    </div>
    <div class="sidebar-subtitle">AG Grid Community Demo</div>
    <n-menu
      :value="activeKey"
      :options="menuOptions"
      @update:value="handleSelect"
      :indent="20"
    />
    <div class="sidebar-footer">
      <span class="footer-badge">ag-grid-community</span>
      <span class="footer-version">MIT License</span>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 260px;
  min-width: 260px;
  background: #1e293b;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 20px 4px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #f1f5f9;
}

.sidebar-subtitle {
  padding: 0 20px 16px;
  font-size: 12px;
  color: #64748b;
}

.sidebar :deep(.n-menu) {
  background: transparent;
  --n-item-text-color: #94a3b8;
  --n-item-text-color-active: #fff;
  --n-item-text-color-hover: #e2e8f0;
  --n-item-color-active: rgba(99, 102, 241, 0.2);
  --n-item-color-hover: rgba(255, 255, 255, 0.05);
  --n-item-icon-color: #94a3b8;
  --n-item-icon-color-active: #fff;
  --n-item-icon-color-hover: #e2e8f0;
}

.sidebar-footer {
  margin-top: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-badge {
  font-size: 11px;
  font-weight: 600;
  color: #22c55e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-version {
  font-size: 11px;
  color: #64748b;
}
</style>
