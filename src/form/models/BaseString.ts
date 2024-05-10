import { has, isInt, isStr, toInt, isEmpty } from '../../fn'
import BaseModel from './Base'
import type { IBaseStringModel, IListModel } from './types'
import type { Object } from '../../types'

export default class BaseStringModel extends BaseModel implements IBaseStringModel {
  minlength: number|null

  maxlength: number|null

  linebreaks: boolean = false

  constructor(def: Object, parent?: IListModel) {
    super(def, parent)
    this.minlength = has(def, 'minlength') && isInt(def.minlength, 1, null, false) ? toInt(def.minlength) : null
    this.maxlength = has(def, 'maxlength') && isInt(def.maxlength, 1, null, false) ? toInt(def.maxlength) : null
  }

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