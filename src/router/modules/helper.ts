import { createWebHashHistory, createWebHistory, createMemoryHistory } from 'vue-router'
import { has, trim, upperFirst, toKey, isStr } from '../../fn'
import type { Router, RouteRecordRaw } from 'vue-router'
import type { IRouterComponentsMap } from '../types'

/**
 * Get history mode.
 */
export function getHistoryMode(mode: string|undefined) {
  switch(toKey(mode)) {
    case 'hash-disabled': // different History modes not supported yet
      return createWebHashHistory()
    case 'memory-disabled':
      return createMemoryHistory()
    default:
       return createWebHistory() // import.meta.env.BASE_URL
  }
}

/**
 * Get a component for dynamic routes.
 */
export function getComponent(components: string|IRouterComponentsMap, blueprint: string): string {
  let component: string
  const key = toKey(blueprint)
  if (isStr(components)) {
    component = components
  } else if(has(components, key)) {
    component = components[key]
  } else {
    component = components.default
  }

  // Replace placeholder for blueprint
  return component
    .replace('%blueprint%', key)
    .replace('%Blueprint%', upperFirst(key))
}