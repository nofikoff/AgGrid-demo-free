<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { drawSparkline } from '../formatters/sparkline'

const props = defineProps<{ data: number[] }>()
const canvas = ref<HTMLCanvasElement>()

onMounted(() => {
  if (canvas.value && props.data && props.data.length > 1) {
    drawSparkline(canvas.value, props.data)
  }
})
</script>

<template>
  <div style="display: flex; align-items: center; height: 100%">
    <canvas ref="canvas" width="140" height="28" style="display: block" />
  </div>
</template>
