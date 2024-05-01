<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { createImage } from '../index'
import type { Props } from './TricImage'

const props = defineProps<Props>()
const thumb = ref()

watchEffect(() => {
  thumb.value = createImage(
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