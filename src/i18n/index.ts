import I18nStore from './classes/I18nStore'
import type { II18nStore } from './types'
import type { IApiAddon } from '../types'

/**
 * Module's store
 */
const store: II18nStore = new I18nStore()

/**
 * Addon factory
 */
export function createI18n(): IApiAddon {
  return {
    name: 'i18n',
    store,
    export: {
      store
    },
  }
}

/**
 * Export module
 */
export { store }