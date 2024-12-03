<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute, RouterView } from 'vue-router'

const route = useRoute()

const layout = computed(() => {
  return defineAsyncComponent(route.meta.layout)
})

// do something each page reload
// onUpdated(() => foo())

</script>

<template>
  <component v-if="route.meta.loaded" :is="layout">
    <Suspense>
      <RouterView />
    </Suspense>
  </component>
</template>