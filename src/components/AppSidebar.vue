<script setup lang="ts">
import { h, computed } from 'vue'
import { useRouter } from 'vue-router'
import { NMenu } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { useEngine } from '../composables/useEngine'

const router = useRouter()
const { engine, meta, switchEngine, ENGINE_OPTIONS, ENGINE_META } = useEngine()

function renderIcon(emoji: string) {
  return () => h('span', { style: 'font-size: 16px' }, emoji)
}

const menuOptions = computed<MenuOption[]>(() => [
  {
    label: 'Campaign Report',
    key: `/${engine.value}/campaign-report`,
    icon: renderIcon('\uD83D\uDCCA'),
  },
  {
    label: 'Country Breakdown',
    key: `/${engine.value}/country-breakdown`,
    icon: renderIcon('\uD83C\uDF0D'),
  },
  {
    label: 'App Performance',
    key: `/${engine.value}/app-performance`,
    icon: renderIcon('\u26A1'),
  },
  {
    label: 'Daily Revenue',
    key: `/${engine.value}/daily-revenue`,
    icon: renderIcon('\uD83D\uDCC5'),
  },
  {
    label: 'Drag & Drop',
    key: `/${engine.value}/drag-drop`,
    icon: renderIcon('\u2195\uFE0F'),
  },
])

const activeKey = computed(() => router.currentRoute.value.path)

function handleSelect(key: string) {
  router.push(key)
}

function onEngineChange(value: string) {
  switchEngine(value as typeof ENGINE_OPTIONS[number])
}
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-logo">
      <span class="logo-icon">📈</span>
      <span class="logo-text">AdTech Grid</span>
    </div>
    <div class="sidebar-subtitle">{{ meta.label }} Demo</div>

    <div class="engine-switcher">
      <n-radio-group :value="engine" size="small" @update:value="onEngineChange">
        <n-radio-button
          v-for="opt in ENGINE_OPTIONS"
          :key="opt"
          :value="opt"
          :label="ENGINE_META[opt].label"
        />
      </n-radio-group>
    </div>

    <n-menu
      :value="activeKey"
      :options="menuOptions"
      @update:value="handleSelect"
      :indent="20"
    />
    <div class="sidebar-footer">
      <span class="footer-badge" :style="{ color: meta.color }">{{ meta.badge }}</span>
      <span class="footer-version">{{ meta.license }}</span>
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
  padding: 0 20px 12px;
  font-size: 12px;
  color: #64748b;
}

.engine-switcher {
  padding: 0 16px 12px;
}

.engine-switcher :deep(.n-radio-group) {
  width: 100%;
  display: flex;
}

.engine-switcher :deep(.n-radio-button) {
  flex: 1;
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
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-version {
  font-size: 11px;
  color: #64748b;
}
</style>
