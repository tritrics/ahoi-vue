<script setup>
import { inject } from 'vue'
import { has } from '../../fn'

const { setLanguage } = inject('api.lang')
const store = inject('api.stores')

const global = store('global')

async function selectLang(lang) {
  await setLanguage(lang)
}
</script>
<template>
  <ul v-if="global.get('multilang')" class="ahoi-lang-switch">
    <li v-for="(language, i) in global.get('languages')" :key="i">
      <a
        :class="{ active: global.isCurrentLang(language.code) }"
        @click="selectLang(language.code)"
      >
        {{ language.meta.title }}
      </a>
    </li>
  </ul>
</template>