<script setup>
import { inject, onUpdated } from 'vue'
import { useRoute, RouterView } from 'vue-router'

const route = useRoute()
const { stores } = inject('api')

// onMounted() not needed, because onUpdated is always invoked.
onUpdated(() => stores('site').commitPage())
</script>

<template>
  <Suspense v-if="route.meta.loaded">
    <RouterView />
  </Suspense>
</template>