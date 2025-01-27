<script setup>
import { computed, inject, onUpdated, defineAsyncComponent } from 'vue'
import { useRoute, RouterView } from 'vue-router'

const route = useRoute()
const { stores } = inject('ahoi')
const init = stores('router').ref('init')
const layout = computed(() => {
  return defineAsyncComponent(route.meta.layout)
})
onUpdated(() => stores('site').commitPage())
</script>

<template>
  <component v-if="init" :is="layout">
      <Suspense>
        <RouterView />
      </Suspense>
  </component>
</template>