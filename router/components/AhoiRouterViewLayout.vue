<script setup>
import { computed, inject, defineAsyncComponent, onUpdated } from 'vue'
import { useRoute, RouterView } from 'vue-router'

const route = useRoute()
const { stores } = inject('api')

function commitPage() {
  stores('page').commit()
}

const layout = computed(() => {
  const path = route.meta.layout
  return defineAsyncComponent(() => import(path))
})

// not needed, because onUpdated is always invoked.
// onMounted(() => commitPage())
onUpdated(() => commitPage())

</script>

<template>
  <component v-if="route.meta.loaded" :is="layout">
    <Suspense>
      <RouterView />
    </Suspense>
  </component>
</template>