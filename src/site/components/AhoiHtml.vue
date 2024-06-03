<script setup lang="ts">
import { has } from '../../fn'
import AhoiNode from './AhoiNode.vue'
import AhoiLink from './AhoiLink.vue'
import type { Props } from './AhoiHtml'

const props = defineProps<Props>()

function getClass(elem: string): any {
  if (props.classes) {
    let res: any[] = []
    if(has(props.classes, elem)) {
      res = res.concat(props.classes[elem])
    }
    if(has(props.classes, '*')) {
      res = res.concat(props.classes['*'])
    }
    return res
  }
}
</script>

<template>
  <template v-for="(child, index) in props.model.value" :key="index">
    <AhoiNode
      v-if="child.type === 'node'"
      :model="child"
      :class="getClass(child.elem)"
      :classes="props.classes"
    />
    <AhoiLink
      v-else-if="child.type === 'link'"
      :to="child"
      :class="getClass('a')"
    />
    <component
      v-else-if="child.type === 'node-self-closing'"
      :is="child.elem"
      v-bind="child.attr"
      :class="getClass(child.elem)"
    />
    <template
      v-else-if="child.type === 'node-text'">
        {{ child }}
    </template>
  </template>
</template>