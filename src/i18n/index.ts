import I18nStore from './classes/I18nStore'
import type { II18nStore } from './types'
import type { IApiAddon } from '../types'

/**
 * Module's store
 */
let store: II18nStore

/**
 * Addon factory
 */
export function createI18n(): Function {
  return (): IApiAddon => {
    store = new I18nStore()
    return {
      name: 'i18n',
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