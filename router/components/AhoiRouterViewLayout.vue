<script setup>
import { computed, inject, defineAsyncComponent, onUpdated } from 'vue'
import { useRoute, RouterView } from 'vue-router'

const route = useRoute()
const { stores } = inject('api')

const layout = computed(() => {
  return defineAsyncComponent(route.meta.layout)
})

// onMounted() not needed, because onUpdated is always invoked.
onUpdated(() => stores('page').commit())

</script>

<template>
  <component v-if="route.meta.loaded" :is="layout">
    <Suspense>
      <RouterView />
    </Suspense>
  </component>
</template>