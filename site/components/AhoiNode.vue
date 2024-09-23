<script setup lang="ts">
import AhoiHtml from './AhoiHtml.vue'
import type { Props } from './AhoiNode'

const props = defineProps<Props>()
</script>

<template>
  <component
    :is="props.model.elem"
    v-bind="props.model.attr"
  >
    <AhoiHtml
      v-if="props.model.has()"
      :model="props.model"
      :classes="props.classes"
    />
    <template v-else>
      {{ props.model.str({ shy: '|' }) }}
    </template>
  </component>
</template>