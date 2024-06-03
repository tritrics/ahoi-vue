<script setup>
import { inject } from 'vue'
import { has } from '../../fn'

const { setLanguage } = inject('api.i18n')
const store = inject('api.stores')

const options = store('options')

async function selectLang(lang) {
  await setLanguage(lang)
}
</script>
<template>
  <ul v-if="options.get('multilang')" class="ahoi-lang-switch">
    <li v-for="(language, i) in options.get('languages')" :key="i">
      <a
        :class="{ active: options.isCurrentLang(language.code) }"
        @click="selectLang(language.code)"
      >
        {{ language.meta.title }}
      </a>
    </li>
  </ul>
</template>