<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { createThumb } from '../thumb'
import type { Props } from './AhoiThumb'

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
  <img v-bind="thumb.attr()" class="ahoi-thumb" />
</template>