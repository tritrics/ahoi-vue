import { extend, has, isTrue, isInt, toInt, isArr, toStr, isEmpty, inArr } from '../../fn'
import { createBase } from './index'
import type { Object, FormModel } from '../../types'

/**
 * Select/Multiselect field
 * Kirby: Checkboxes, Multiselect, Radio, Select, Toggles
 */
export default function createSelect(def: Object): FormModel {

  // Base select object
  const injectBase: Object = {
    type: 'select',
    required: has(def, 'required') && isTrue(def.required, false) ? true : false,
    multiple: has(def, 'multiple') && isTrue(def.multiple, false),
    options: has(def, 'options') && isArr(def.options) ? def.options : [],
    validate() {
      if (isEmpty(this.value)) {
        if (this.required) {
          return this.setValid('required')
        }
      } else if (!inArr(this.value, this.options)) {
        return this.setValid('type')
      } else if (this.multiple) {
        if (this.min && !isInt(this.value.length, this.min)) {
          return this.setValid('min')
        } else if (this.max && !isInt(this.value.length, null, this.max)) {
          return this.setValid('max')
        }
      }
      return this.setValid()
    },
    data() {
      if (this.multiple) {
        return this.value.map((entry: any) => toStr(entry))
      } else {
        return toStr(this.value)
      }
    },
    toString() {
      const res = this.data()
      return isArr(res) ? res.toString() : res
    }
  }

  // multiple or not
  let inject: Object = {}
  if (injectBase.multiple) {
    inject = {
      value: has(def, 'value') && isArr(def.value) ? def.value : [],
      min: has(def, 'min') && isInt(def.min, 1, null, false) ? toInt(def.min) : null,
      max: has(def, 'max') && isInt(def.max, 1, null, false) ? toInt(def.max) : null,
    }
  } else {
    inject = {
      value: has(def, 'value') ? toStr(def.value) : '',
    }
  }
  return extend(createBase(), injectBase, inject) as FormModel
}