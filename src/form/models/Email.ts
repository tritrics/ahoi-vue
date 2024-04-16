import { extend, has, isEmpty, isEmail, toStr, isTrue } from '../../fn'
import { createBase } from './index'
import type { Object, FormModel} from '../../types'

/**
 * Email field
 * Kirby: Email
 */
export default function createEmail(def: Object): FormModel {
  const inject: Object = {
    type: 'email',
    value: has(def, 'value') ? toStr(def.value) : '',
    required: has(def, 'required') && isTrue(def.required, false) ? true : false,
    validate() {
      if (isEmpty(this.value)) {
        if (this.required) {
          return this.setValid('required')
        }
      } else if(!isEmail(this.value)) {
        return this.setValid('type')
      }
      return this.setValid()
    },
  }
  return extend(createBase(), inject) as FormModel
}