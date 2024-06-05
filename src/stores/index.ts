import { has, isStr } from '../fn'
import Store from './Store'
import Options from './Options'
import type { IStore } from './types'
import type { Object, IApiAddon } from '../types'

/**
 * Object with all stores.
 */
export const stores: Object = {
  global: new Options()
}

/**
 * Get og implicitely create a store.
 */
export function store(name: string, values?: Object): IStore {
  if (isStr(name, 1) && !has(stores, name)) {
    stores[name] = new Store()
    stores[name].set(values)
  }
  return stores[name] 
}

/**
 * Addon
 */
export function createStores(): IApiAddon {
  return {
    name: 'stores',
    export: store
  }
}