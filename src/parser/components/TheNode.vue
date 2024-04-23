<script setup lang="ts">
  import TheNodes from './TheNodes.vue'
  import type { Props } from './TheNode'

  const props = defineProps<Props>()
</script>

<template>
  <component :is="props.model.$elem()" v-bind="props.model.$attr()">
    <TheNodes v-if="props.model.$hasChildren()" :model="props.model" />
    <template v-else>{{ props.model.$val() }}</template>
  </component>
</template>