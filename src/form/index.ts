import { has, isObj, isStr } from '../fn'
import FormStore from './classes/FormStore'
import type { IApiAddon, IFormStore, Object, IFormOptions } from '../types'

/**
 * Map holding all forms.
 */
const formsMap: Object = {}

/**
 * Get, register or implicitely create a form.
 */
function forms(mixed: string|IFormOptions, options?: IFormOptions): IFormStore {

  // no name given, options in mixed, don't register form
  if (!isStr(mixed, 1)) {
    const form: IFormStore = new FormStore()
    setOptions(form, options)
    return form
  }
  
  // create form
  if (!has(formsMap, mixed)) {
    formsMap[mixed] = new FormStore()
    setOptions(formsMap[mixed], options)
  }
  return formsMap[mixed]
}

/**
 * Setting form options
 */
function setOptions(form: IFormStore, options?: IFormOptions): void {
  if (isObj(options)) {
    if(!isObj(options.fields)) {
      options.fields = getFieldDefsFromApi(options)
    }
    form.init(options)
  }
}

  /**
   * Request field definition from blueprint by given action
   * @TODO: request from Kirby
   */
 function getFieldDefsFromApi(options: Object): Object {
    return {}
  }

/**
 * Addon factory
 */
export function createForm(): IApiAddon {
  return {
    name: 'form',
    export: {
      forms,
    },
  }
}

/**
 * Export module
 */
export { forms }