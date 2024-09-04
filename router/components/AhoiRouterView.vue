<script setup>
import { inject, onUpdated } from 'vue'
import { useRoute, RouterView } from 'vue-router'

const route = useRoute()
const { stores } = inject('api')

function commitPage() {
  stores('page').commit()
}

// not needed, because onUpdated is always invoked.
// onMounted(() => commitPage())
onUpdated(() => commitPage())
</script>

<template>
  <Suspense v-if="route.meta.loaded">
    <RouterView />
  </Suspense>
</template>