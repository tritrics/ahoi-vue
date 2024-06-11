<script setup lang="ts">
import { inject } from 'vue'
import type { Props } from './AhoiLangSwitch.d'

const props = defineProps<Props>()

const { store } = inject('api')

async function selectLang(code: string) {
  await store.set('lang', code)
}
</script>
<template>
  <ul v-if="store.isTrue('multilang')" class="ahoi-lang-switch">
    <li v-for="(language, i) in store.get('languages')" :key="i">
      <a
        :class="{ active: store.isCurrentLang(language.meta.code) }"
        @click="selectLang(language.meta.code)"
      >
        {{ language.meta.title }}
      </a>
    </li>
  </ul>
</template>