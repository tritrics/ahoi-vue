<script setup>
import { useRoute, RouterView } from 'vue-router'

const route = useRoute()

// do something each page reload
// onUpdated(() => foo())
</script>

<template>
  <Suspense v-if="route.meta.loaded">
    <RouterView />
  </Suspense>
</template>