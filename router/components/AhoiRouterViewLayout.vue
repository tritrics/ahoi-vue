<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute, RouterView } from 'vue-router'

const route = useRoute()

const layout = computed(() => {
  const path = route.meta.layout
  return defineAsyncComponent(() => import(/* @vite-ignore */path))
})

const isLoaded = computed(() => {
  return route.meta.loaded
})
</script>

<template>
  <component v-if="isLoaded" :is="layout">
    <Suspense>
      <RouterView />
    </Suspense>
  </component>
</template>