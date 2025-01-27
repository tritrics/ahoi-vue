<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { createThumb } from '../index'
import type { Props } from './AhoiThumb'

const props = defineProps<Props>()
const thumb = ref()

const bgImage = computed((): string => {
  if (thumb.value) {
    return `background-image:url(${thumb.value.src()})`
  }
  return ''
})

watchEffect(() => {
  thumb.value = createThumb(
    props.model,
    props.width ?? null,
    props.height ?? null,
    props.options ?? {}
  )
})
</script>

<template>
  <div v-if="props.background" :style="bgImage" class="ahoi-thumb-background"></div>
  <img v-else v-bind="thumb.attr()" class="ahoi-thumb" />
</template>
