<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { createThumb } from '../Thumb'
import type { Props } from './TricThumb'

const props = defineProps<Props>()
const thumb = ref()

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
  <img v-bind="thumb.attr()" />
</template>