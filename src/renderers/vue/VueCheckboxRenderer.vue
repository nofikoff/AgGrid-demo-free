<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ params: any }>()
const checked = ref(false)

onMounted(() => {
  checked.value = !!props.params.value
})

function onChange() {
  props.params.node.setDataValue(props.params.column.getColId(), checked.value)
}
</script>

<template>
  <input
    type="checkbox"
    v-model="checked"
    @change="onChange"
    style="cursor: pointer; width: 16px; height: 16px"
  />
</template>
