import { createWebHashHistory, createWebHistory, createMemoryHistory } from 'vue-router'
import { toKey, isStr } from '../../fn'
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
export function getComponent(components: string|IRouterComponentsMap, key: string): Promise<any> {
  let component: string
  if (isStr(components)) {
    component = components
  } else {
    component = components[key] ?? components.default
  }
  return import(component)
}