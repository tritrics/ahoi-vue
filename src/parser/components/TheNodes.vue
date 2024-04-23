<script setup lang="ts">
  import TheNode from './TheNode.vue'
  import TheLink from './TheLink.vue'
  import type { Props } from './TheNodes'
  
  const props = defineProps<Props>()
</script>

<template>
  <template v-for="(child, key) in props.model.$val()" :key="key">
    <TheNode v-if="child.$type === 'node'" :model="child" />
    <TheLink v-else-if="child.$type === 'link'" :to="child" />
    <component v-else-if="child.$type === 'node-self-closing'" :is="child.$elem()" v-bind="child.$attr()" />
    <template v-else-if="child.$type === 'node-text'">{{ child.$val() }}</template>
  </template>
</template>