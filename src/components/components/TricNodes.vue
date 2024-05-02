<script setup lang="ts">
import TricNode from './TricNode.vue'
import TricLink from './TricLink.vue'
import type { Props } from './TricNodes'

const props = defineProps<Props>()
</script>

<template>
  <template v-for="(child, key) in props.model.value" :key="key">
    <TricNode v-if="child.$type === 'node'" :model="child" />
    <TricLink v-else-if="child.$type === 'link'" :to="child" />
    <component v-else-if="child.$type === 'node-self-closing'" :is="child.$elem()" v-bind="child.$attr()" />
    <template v-else-if="child.$type === 'node-text'">{{ child }}</template>
  </template>
</template>