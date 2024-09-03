<script setup lang="ts">
import { ref, computed, watchEffect, getCurrentInstance } from 'vue'
import LinkModel from '../models/Link'
import { isStr, isObj, has } from '../../fn'
import { globalStore } from '../../plugin'
import type { Ref } from 'vue'
import type { Object } from '../../types'
import type { Props, Attributes, ILinkA, ILinkRouter, ILinkRouterName, ILinkRouterPath } from './AhoiLink'

/**
 * to can be a string (=url), a route-defintion object or an api.site object.
 */
const props = withDefaults(defineProps<Props>(), {
  to: '',
  disabled: false
})

/**
 * Emit a click event.
 */
const emit = defineEmits<{
  click: [ e: Event, to: string | Object ],
}>()

/**
 * Using router-link depends on setting in globalStore AND if router is installed.
 * (needs to be computed value, fails otherwise in watchEffect())
 */
const useRouter = computed(() => {
  return globalStore.isTrue('router') && !!getCurrentInstance()?.appContext.config.globalProperties.$router
})

/**
 * Normalized data for link generation.
 */
const link: Ref<ILinkA|ILinkRouter|undefined >  = ref()

/**
 * All the attributes
 */
const attr = computed<Attributes>(() => {
  let res: Attributes = {}
  if (link.value) {
    if (link.value.href) {
      res.href = link.value.href
    }
    res.class = `link ${link.value.type}`
    if (link.value.type === 'url') {
      res.target = '_blank'
    }
    if (props.disabled) {
      res.disabled = "disabled"
      res.class = `${res.class} disabled`
    }
  }
  return res
})

/**
 *  Normalize props.to, can be string, model or router params
 */
watchEffect(() => {

  const res: Object = {}

  // to is instance of LinkModel
  if (props.to instanceof LinkModel) {
    res.type = props.to.attr['data-type']
    res.title = props.to.str()
    if (res.type === 'page' && useRouter.value) {
      res.elem = 'router-link'
      res.to = {
        path: props.to.attr.href
      }
    } else {
      res.elem = 'a'
      res.href = props.to.attr.href
    }
  }

  // to is vue-router params
  else if (isObj(props.to) && (has(props.to, 'path') || has(props.to, 'name'))) {
    res.type = 'page'
    res.title = ''
    if (useRouter.value) {
      res.elem = 'router-link'
      res.to = props.to as ILinkRouterName|ILinkRouterPath
    } else {
      res.elem = 'a'
      res.href = props.to.path ?? props.to.name
    }
  }
  
  // to is string
  else if (isStr(props.to, 1)) {
    res.type = 'page'
    res.title = ''
    if (props.to.substring(0, 1) === '/') {
      if (res.type === 'page' && useRouter.value) {
        res.elem = 'router-link'
        res.to = {
          path: props.to
        }
      } else {
        res.elem = 'a'
        res.href = props.to
      }
    } else {
      res.elem = 'a'
      res.href = props.to
      if(props.to.substring(0, 7) === 'http://' || props.to.substring(0, 8) === 'https://') {
        res.type = 'url' // file is url here, because it's not possible to distinguish
      }  else if(props.to.substring(0, 7) === 'mailto:') {
        res.type = 'email'
      } else if(props.to.substring(0, 4) === 'tel:') {
        res.type = 'tel'
      } else if (props.to.substring(0, 1) === '#') {
        res.type = 'anchor'
      } else {
        res.type = 'custom'
      }
    }
  }
  if (res.elem) {
    link.value = res as ILinkA|ILinkRouter
  }
})

/**
 * Emit click event if not disabled.
 */
function onClick(e: Event) {
  if (!props.disabled) {
    emit('click', e, props.to)
  }
}
</script>

<template>
  <component
    v-if="link"
    :is="link.elem"
    :to="link.to"
    v-bind="attr"
    @click="onClick($event)"
    class="ahoi-link"
  >
    <slot>{{ link.title }}</slot>
  </component>
</template>