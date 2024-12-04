<script setup>
import { inject, onUpdated } from 'vue'
import { RouterView } from 'vue-router'

const { store: routerStore } = inject('api.router')
const { store: siteStore } = inject('api.site')
const init = routerStore.ref('init')
onUpdated(() => siteStore.commitPage())
</script>

<template>
  <Suspense v-if="init">
    <RouterView />
  </Suspense>
</template>