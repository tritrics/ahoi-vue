import { inArr } from '../utils'
import MetaStore from './classes/MetaStore'
import type { IMetaStore } from './types'
import type { IApiAddon } from '../types'

/**
 * Addon store
 */
const metaStore: IMetaStore = new MetaStore()

 /**
 * Addon factory
 */
function createMeta(): IApiAddon {
  return {
    name: 'meta',
    store: metaStore,
    export: {},
    dependencies(addons: string[]): void {
      if(!inArr('template', addons)) {
        throw new Error('[AHOI] Addon meta requires addon site.')
      }
    }
  }
}

/**
 * Export module
 */
export {
  createMeta,
  metaStore,
}