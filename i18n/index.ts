import { inArr } from '../utils'
import I18nStore from './classes/I18nStore'
import type { II18nStore } from './types'
import type { IApiAddon } from '../types'

/**
 * Addon store
 */
const i18nStore: II18nStore = new I18nStore()

/**
 * Addon factory
 */
function createI18n(): IApiAddon {
  return {
    name: 'i18n',
    store: i18nStore,
    export: {},
    dependencies(addons: string[]): void {
      if(!inArr('template', addons)) {
        throw new Error('[AHOI] Addon i18n requires addon template.')
      }
    }
  }
}

/**
 * Export module
 */
export {
  createI18n,
  i18nStore,
}