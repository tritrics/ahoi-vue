<script setup lang="ts">
import { ref, computed, watchEffect, getCurrentInstance } from 'vue'
import { isStr, isObj, has } from '../../fn'
import { store } from '../../api/store'
import type { Ref } from 'vue'
import type { Object } from '../../types'
import type { ILinkModel } from '../models/types'
import type { Props, ElemType, Attributes, LinkString, LinkApi, LinkRouter, LinkType } from './AhoiLink'

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
 * Normalized data for link generation.
 */
let link: Ref<LinkString | LinkRouter | LinkApi >  = ref({
  source: 'string',
  type: 'custom',
  data: ''
})

/**
 * Is the link an intern page/router-link?
 * Only true if router is installed.
 */
const isRouterLink = computed<boolean>(() => {
  return (
    link.value.type === 'page' &&
    store.router === true &&
    !!getCurrentInstance()?.appContext.config.globalProperties.$router
  )
})

/**
 * HTML element
 */
const elem = computed<ElemType>(() => {
  return isRouterLink.value ? 'router-link' : 'a'
})

/**
 * For router-links data must be added to :to
 * null will not be visible in normal <a>
 */
const to = computed<Object|string|null>(() => {
  return isRouterLink.value ? link.value.data : null
})

/**
 * All the attributes
 */
const attr = computed<Attributes>(() => {
  let res: Attributes = {}
  if (!isRouterLink.value) {
    let href: any
    if (link.value.source === 'api') {
      href = link.value.data.attr.href
    } else if (link.value.source === 'router') { // router-link given, but router not installed
      href = link.value.data.path
    } else if (link.value.source === 'string') {
      href = link.value.data
    }
    if (isStr(href, 1)) {
      res.href = href
    }
  }
  res.class = `link ${link.value.type}`
  if (link.value.type === 'url') {
    res.target = '_blank'
  }
  if (props.disabled) {
    res.disabled = "disabled"
    res.class = `${res.class} disabled`
  }
  return res
})

/**
 * The link text, overwritten by optional given slot.
 */
const value = computed((): string => {
  return link.value.source === 'api' ? link.value.data.value : ''
})

/**
 *  Normalize props.to, can be string, object from parser or router params
 */
watchEffect(() => {
  if (isObj(props.to)) {

    // Is props.to a link object from api.site?
    if (props.to?.link?.type === 'link' || props.to?.type === 'link') {
      link.value = {
        source: 'api',
        type: props.to.link?.attr.type ?? props.to.attr.type,
        data: props.to.link ?? props.to as ILinkModel
      }
    }
    
    // Is props.to a route defintion for vue-router?
    if (has(props.to, 'name') || has(props.to, 'path')) {
      link.value = {
        source: 'router',
        type: 'page',
        data: props.to
      }
    }
  }

  // Is props.to a simple string representing an url etc.?
  else {
    let type: LinkType = 'custom'
    let data: string = ''
    if (isStr(props.to, 1)) {
      if(props.to.substring(0, 7) === 'http://' || props.to.substring(0, 8) === 'https://') {
        type = 'url'
      }  else if (props.to.substring(0, 1) === '/') {
        type = 'page'
      } else if(props.to.substring(0, 7) === 'mailto:') {
        type = 'email'
      } else if(props.to.substring(0, 4) === 'tel:') {
        type = 'tel'
      } else if (props.to.substring(0, 1) === '#') {
        type = 'anchor'
      }
      data = props.to
    }
    link.value = {
      source: 'string',
      type: type,
      data: data
    }
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
  <component :is="elem" :to="to" v-bind="attr" @click="onClick($event)">
    <slot>{{ value }}</slot>
  </component>
</template>