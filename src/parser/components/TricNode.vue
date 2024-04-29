<script setup lang="ts">
import TricNodes from './TricNodes.vue'
import type { Props } from './TricNode'

const props = defineProps<Props>()
</script>

<template>
  <component :is="props.model.$elem()" v-bind="props.model.$attr()">
    <TricNodes v-if="props.model.$hasChildren()" :model="props.model" />
    <template v-else>{{ props.model.value }}</template>
  </component>
</template>