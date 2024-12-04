<script setup>
import { computed, inject, onUpdated, defineAsyncComponent } from 'vue'
import { useRoute, RouterView } from 'vue-router'

const route = useRoute()
const { store: routerStore } = inject('api.router')
const { store: siteStore } = inject('api.site')
const init = routerStore.ref('init')
const layout = computed(() => {
  return defineAsyncComponent(route.meta.layout)
})
onUpdated(() => siteStore.commitPage())
</script>

<template>
  <component v-if="init" :is="layout">
      <Suspense>
        <RouterView />
      </Suspense>
  </component>
</template>