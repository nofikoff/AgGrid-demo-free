<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import type { EngineType } from '../../types/engines'

const route = useRoute()
const engine = computed(() => route.params.engine as EngineType)

const engineComponents: Record<EngineType, ReturnType<typeof defineAsyncComponent>> = {
  aggrid: defineAsyncComponent(() => import('../aggrid/DragDropPriority.vue')),
  tabulator: defineAsyncComponent(() => import('../tabulator/DragDropPriority.vue')),
  primevue: defineAsyncComponent(() => import('../primevue/DragDropPriority.vue')),
}
</script>

<template>
  <component :is="engineComponents[engine]" />
</template>
