import { has, isStr } from '../fn'
import FormStore from './classes/FormStore'
import type { IApiAddon, IFormStore, Object, IFormOptions } from '../types'

/**
 * Map holding all forms.
 */
const formsMap: Object = {}

/**
 * Get, register or implicitely create a form.
 * @TODO: request fielddef from Kirby
 */
function forms(mixed: string|IFormOptions, options?: IFormOptions): IFormStore {

  // no name given, options in mixed, don't register form
  if (!isStr(mixed)) {
    return new FormStore(mixed)
  }
  
  // create form
  if (!has(formsMap, mixed)) {
    formsMap[mixed] = new FormStore(options)
  }
  return formsMap[mixed]
}

/**
 * Addon factory
 */
export function createForm(): IApiAddon {
  return {
    name: 'form',
    export: {
      forms,
    }
  }
}

/**
 * Export module
 */
export { forms }