import { has, isTrue, isInt, isStr, toInt, toStr, isEmpty, extend } from '../../fn'
import { createBase } from './index'
import type { Object, IFormModel } from '../../types'

/**
 * String field (single line, no breaks)
 * Kirby: Color, Slug, Text
 */
export default function createString(def: Object, parent = {}): IFormModel {
  const inject: Object = {
    type: 'string',
    value: has(def, 'value') ? toStr(def.value) : '',
    required: has(def, 'required') && isTrue(def.required, false) ? true : false,
    minlength: has(def, 'minlength') && isInt(def.minlength, 1, null, false) ? toInt(def.minlength) : null,
    maxlength: has(def, 'maxlength') && isInt(def.maxlength, 1, null, false) ? toInt(def.maxlength) : null,
    linebreaks: false,
    validate() {
      if (isEmpty(this.value)) {
        if (this.required) {
          return this.setValid('required')
        }
      } else if(!isStr(this.value, null, null, this.linebreaks)) {
        return this.setValid('type')
      } else if(this.minlength && !isStr(this.value, this.minlength)) {
        return this.setValid('minlength')
      } else if(this.maxlength && !isStr(this.value, null, this.maxlength)) {
        return this.setValid('maxlength')
      }
      return this.setValid()
    }
  }
  return extend(createBase(), inject, parent) as IFormModel
}
