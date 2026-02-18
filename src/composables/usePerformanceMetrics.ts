import { ref, onUnmounted } from 'vue'

export function usePerformanceMetrics() {
  const fps = ref(0)
  const renderTime = ref(0)
  const rowCount = ref(0)

  let frameCount = 0
  let lastTime = performance.now()
  let rafId = 0
  let running = false

  function measureFps() {
    frameCount++
    const now = performance.now()
    if (now - lastTime >= 1000) {
      fps.value = frameCount
      frameCount = 0
      lastTime = now
    }
    if (running) {
      rafId = requestAnimationFrame(measureFps)
    }
  }

  function startMeasuring() {
    running = true
    lastTime = performance.now()
    frameCount = 0
    rafId = requestAnimationFrame(measureFps)
  }

  function stopMeasuring() {
    running = false
    cancelAnimationFrame(rafId)
  }

  function recordRenderTime(startMs: number) {
    renderTime.value = Math.round(performance.now() - startMs)
  }

  function setRowCount(count: number) {
    rowCount.value = count
  }

  onUnmounted(() => {
    stopMeasuring()
  })

  return {
    fps,
    renderTime,
    rowCount,
    startMeasuring,
    stopMeasuring,
    recordRenderTime,
    setRowCount,
  }
}
