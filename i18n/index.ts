import { inArr } from '../fn'
import I18nStore from './classes/I18nStore'
import type { II18nStore } from './types'
import type { IApiAddon } from '../types'

/**
 * Module's store
 */
const i18nStore: II18nStore = new I18nStore()

/**
 * Addon factory
 */
export function createI18n(): IApiAddon {
  return {
    name: 'i18n',
    store: i18nStore,
    export: {
      store: i18nStore
    },
    dependencies(addons: string[]): void {
      if(!inArr('site', addons)) {
        throw new Error('AHOI Plugin: Addon i18n requires addon site.')
      }
    }
  }
}

/**
 * Export module
 */
export { i18nStore }