import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { EngineType } from '../types/engines'
import { ENGINE_META, ENGINE_OPTIONS } from '../types/engines'

const STORAGE_KEY = 'table-engine'

export function useEngine() {
  const route = useRoute()
  const router = useRouter()

  const engine = computed<EngineType>(() => {
    const param = route.params.engine as string
    if (ENGINE_OPTIONS.includes(param as EngineType)) return param as EngineType
    return (localStorage.getItem(STORAGE_KEY) as EngineType) || 'aggrid'
  })

  const meta = computed(() => ENGINE_META[engine.value])

  function switchEngine(newEngine: EngineType) {
    localStorage.setItem(STORAGE_KEY, newEngine)
    const currentPath = route.path
    const segments = currentPath.split('/').filter(Boolean)
    // Replace engine segment (first segment) or prepend
    if (ENGINE_OPTIONS.includes(segments[0] as EngineType)) {
      segments[0] = newEngine
    } else {
      segments.unshift(newEngine)
    }
    router.push('/' + segments.join('/'))
  }

  return {
    engine,
    meta,
    switchEngine,
    ENGINE_OPTIONS,
    ENGINE_META,
  }
}
