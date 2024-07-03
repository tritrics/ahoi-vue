import MetaStore from './classes/MetaStore'
import type { IMetaStore } from './types'
import type { IApiAddon } from '../types'

/**
 * Module's store
 */
const store: IMetaStore = new MetaStore()

 /**
 * Addon factory
 */
export function createMeta(): IApiAddon {
  return {
    name: 'meta',
    store,
    export: {
      store
    }
  }
}

/**
 * Export module
 */
export { store }