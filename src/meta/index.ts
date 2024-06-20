import MetaStore from './classes/MetaStore'
import type { IMetaStore } from './types'
import type { IApiAddon } from '../types'

/**
 * Module's store
 */
let store: IMetaStore

 /**
 * Addon factory
 */
export function createMeta(): Function {
  return (): IApiAddon => {
    store = new MetaStore()
    return {
      name: 'meta',
      store,
      export: {
        store
      }
    }
  }
}

/**
 * Export module
 */
export { store }