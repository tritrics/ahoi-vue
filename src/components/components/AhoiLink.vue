<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { isStr, has } from '../../fn'
import type { Ref } from 'vue'
import type { Object } from '../../types'
import type { ILinkModel } from '../models/types'
import type { Props, ElemType, Attributes, LinkString, LinkApi, LinkRouter, LinkNone, LinkType } from './AhoiLink'

const props = withDefaults(defineProps<Props>(), {
  to: '',
  disabled: false
})

const emit = defineEmits<{
  click: [ e: Event, to: string | Object ],
}>()

let link: Ref<LinkString | LinkRouter | LinkApi | LinkNone>  = ref({
  source: 'none',
  type: 'custom'
})

const elem = computed<ElemType>(() => {
  if (link.value.type === 'page') {
    return 'router-link'
  }
  return 'a'
})

const attr = computed<Attributes>(() => {
  let res: Attributes = {}
  switch(link.value.source) {
    case 'api':
      res.href = link.value.data.attr.href
      break
    case 'string':
      if (link.value.type !== 'page') {
        res.href = link.value.data
      }
      break
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

const to = computed<Object|string|null>(() => {
  if (link.value.source !== 'none' && link.value.type === 'page') {
    return link.value.data
  }
  return null // will not be visible in normal <a>
})

const value = computed((): string => {
  if (link.value.source === 'api') {
    return link.value.data.value
  }
  return ''
})

// Normalize props.to, can be string, object from parser or router params
watchEffect(() => {
  if (isStr(props.to, 1)) {
    let type: LinkType
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
    } else {
      type = 'custom'
    }
    link.value = {
      source: 'string',
      type: type,
      data: props.to
    }
  } else if (props.to?.link?.type === 'link' || props.to?.type === 'link') {
    link.value = {
      source: 'api',
      type: props.to.link?.attr.type ?? props.to.attr.type,
      data: props.to.link ?? props.to as ILinkModel
    }
  } else if (has(props.to, 'name') || has(props.to, 'path')) {
    link.value = {
      source: 'router',
      type: 'page',
      data: props.to
    }
  } else {
    link.value = {
      source: 'none',
      type: 'custom'
    }
  }
})

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