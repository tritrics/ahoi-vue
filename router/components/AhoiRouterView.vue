<script setup>
import { inject, onUpdated } from 'vue'
import { RouterView } from 'vue-router'

const { stores } = inject('ahoi')
const init = stores('router').ref('init')
onUpdated(() => stores('site').commitPage())
</script>

<template>
  <Suspense v-if="init">
    <RouterView />
  </Suspense>
</template>