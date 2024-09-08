<script setup>
import { inject, onUpdated } from 'vue'
import { useRoute, RouterView } from 'vue-router'

const route = useRoute()
const { stores } = inject('api')

// onMounted() not needed, because onUpdated is always invoked.
onUpdated(() => stores('page').commit())
</script>

<template>
  <Suspense v-if="route.meta.loaded">
    <RouterView />
  </Suspense>
</template>