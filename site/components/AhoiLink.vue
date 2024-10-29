<script setup lang="ts">
import { ref, computed, watchEffect, getCurrentInstance } from 'vue'
import PageModel from '../models/Page'
import FileModel from '../models/File'
import TranslationModel from '../models/Translation'
import { isStr, isObj, toStr, has } from '../../utils'
import { apiStore } from '../../plugin'
import type { Ref } from 'vue'
import type { Object } from '../../types'
import type { Props, Attributes, ILinkA, ILinkRouter, ILinkRouterName, ILinkRouterPath } from './AhoiLink'

/**
 * to can be a string (=url), a route-defintion object or an api.site object.
 */
const props = withDefaults(defineProps<Props>(), {
  to: '',
  disabled: false,
  blank: false
})

/**
 * Emit a click event.
 */
const emit = defineEmits<{
  click: [ e: Event, to: string | Object ],
}>()

/**
 * Using router-link depends on setting in apiStore AND if router is installed.
 * (needs to be computed value, fails otherwise in watchEffect())
 */
const useRouter = computed(() => {
  return apiStore.hasRouter() && !!getCurrentInstance()?.appContext.config.globalProperties.$router
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
    res.class = `ahoi-link ${link.value.type}`
    if (link.value.type === 'url' || link.value.type === 'file' || props.blank) {
      res.target = '_blank'
    }
    if (props.disabled) {
      res.disabled = "disabled"
      res.class = `${res.class} is-disabled`
    }
  }
  return res
})

/**
 *  Normalize props.to, can be string, model or router params
 */
watchEffect(() => {

  const res: Object = {}

  // to
  // extract link, if props.to is instance of PageModel, FileModel or TranslationModel
  // otherwise use props.to as it is
  const to =
    (props.to instanceof PageModel || props.to instanceof FileModel || props.to instanceof TranslationModel)
    ? props.to.link
    : props.to

  // to is instance of LinkModel
  if (isObj(to) && (has(to, 'attr') && has(to.attr, 'data-type') && has(to.attr, 'href'))) {
    res.type = to.attr['data-type']
    res.title = toStr(to.value) ?? to.attr.href
    if (res.type === 'page' && useRouter.value) {
      res.elem = 'router-link'
      res.to = {
        path: to.attr.href
      }
    } else {
      res.elem = 'a'
      res.href = to.attr.href
    }
  }

  // to is vue-router params
  else if (isObj(to) && (has(to, 'path') || has(to, 'name'))) {
    res.type = 'page'
    res.title = ''
    if (useRouter.value) {
      res.elem = 'router-link'
      res.to = to as ILinkRouterName|ILinkRouterPath
    } else {
      res.elem = 'a'
      res.href = to.path ?? to.name
    }
  }
  
  // to is string
  else if (isStr(to, 1)) {
    res.type = 'page'
    res.title = ''
    if (to.substring(0, 1) === '/') {
      if (res.type === 'page' && useRouter.value) {
        res.elem = 'router-link'
        res.to = {
          path: to
        }
      } else {
        res.elem = 'a'
        res.href = to
      }
    } else {
      res.elem = 'a'
      res.href = to
      if(to.substring(0, 7) === 'http://' || to.substring(0, 8) === 'https://') {
        res.type = 'url' // file is url here, because it's not possible to distinguish
      }  else if(to.substring(0, 7) === 'mailto:') {
        res.type = 'email'
      } else if(to.substring(0, 4) === 'tel:') {
        res.type = 'tel'
      } else if (to.substring(0, 1) === '#') {
        res.type = 'anchor'
      } else {
        res.type = 'custom'
      }
    }
  }

  // rewrite disabled links (easier here)
  if(props.disabled) {
    res.elem = 'a'
    delete res.href
    delete res.to
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
  >
    <slot>{{ link.title }}</slot>
  </component>
</template>