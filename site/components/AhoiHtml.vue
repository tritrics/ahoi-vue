<script setup lang="ts">
import { has } from '../../fn'
import AhoiNode from './AhoiNode.vue'
import AhoiLink from './AhoiLink.vue'
import type { Props } from './AhoiHtml'
import type { Object } from '../../types'

const props = defineProps<Props>()

function getAttr(elem: string, attr: Object): any {
  const res: Object = { ...attr }
  if (props.classes) {
    let classes: any[] = []
    if(has(props.classes, '*')) {
      classes = classes.concat(props.classes['*'])
    }
    if(has(props.classes, elem)) {
      classes = classes.concat(props.classes[elem])
    }
    if (classes.length > 0) {
      res.class = classes.join(' ')
    }
  }
  return res
}
</script>

<template>
  <template v-for="(child, index) in props.model.value" :key="index">
    <AhoiNode
      v-if="child.type === 'node'"
      :model="child"
      :classes="props.classes"
      v-bind="getAttr(child.elem, {})"
    />
    <AhoiLink
      v-else-if="child.type === 'link'"
      :to="child"
      v-bind="getAttr('a', {})"
    />
    <component
      v-else-if="child.type === 'node-self-closing'"
      :is="child.elem"
      v-bind="getAttr(child.elem, child.attr ?? {})"
    />
    <template
      v-else-if="child.type === 'node-text'">
        {{ child }}
    </template>
  </template>
</template>