<script setup>
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'

const route = useRoute()

const isLoaded = computed(() => {
  return route.meta.loaded
})
</script>

<template>
  <Suspense v-if="isLoaded">
    <RouterView />
  </Suspense>
</template>