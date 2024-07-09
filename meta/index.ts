import MetaStore from './classes/MetaStore'
import type { IMetaStore } from './types'
import type { IApiAddon } from '../types'

/**
 * Module's store
 */
const metaStore: IMetaStore = new MetaStore()

 /**
 * Addon factory
 */
export function createMeta(): IApiAddon {
  return {
    name: 'meta',
    store: metaStore,
    export: {
      store: metaStore
    }
  }
}

/**
 * Export module
 */
export { metaStore }