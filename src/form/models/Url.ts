import { extend, has, isEmpty, isUrl, toStr, isTrue } from '../../fn'
import { createBase } from './index'
import type { Object, IFormModel } from '../../types'

/**
 * Url field
 * Kirby: Url
 */
export default function createUrl(def: Object): IFormModel {
  const inject: Object = {
    type: 'url',
    value: has(def, 'value') ? toStr(def.value) : '',
    required: has(def, 'required') && isTrue(def.required, false) ? true : false,
    validate() {
      if (isEmpty(this.value)) {
        if (this.required) {
          return this.setValid('required')
        }
      } else if(!isUrl(this.value)) {
        return this.setValid('type')
      }
      return this.setValid()
    },
  }
  return extend(createBase(), inject) as IFormModel
}