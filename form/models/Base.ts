import { watchEffect } from 'vue'
import { toStr, isEmpty, uuid, has, isTrue } from '../../fn'
import type { ModelTypes, IBaseModel, IListModel } from './types'
import type { Object, FormPostValue } from "../../types"

export default class BaseModel implements IBaseModel {
  type: ModelTypes = 'base'

  id: string 

  value: any
  
  required: boolean

  valid: boolean = true
  
  msg: string = ''

  stop: Function|null = null

  parent?: IListModel
  
  constructor(def: Object, parent?: IListModel) {
    this.id = uuid()
    this.value = has(def, 'value') ? toStr(def.value) : ''
    this.required = has(def, 'required') && isTrue(def.required, false) ? true : false
    if(parent instanceof BaseModel && parent.type === 'list') { // ListModel due to circular referenciation not possible here
      this.parent = parent
    }
  }
  
  // val important to kick off the watchEffect
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(val?: any): void {
    return this.setValid()
  }

  setValid(msg: string = ''): void {
    this.valid = isEmpty(msg)
    this.msg = msg
  }

  watch(start: boolean = true): void {
    if (start) {
      if(this.stop === null) {
        this.stop = watchEffect(() => {
          this.validate(this.value)
        })
      }
    } else if (this.stop !== null) {
      this.stop()
      this.stop = null
    }
  }

  data(): FormPostValue {
    return toStr(this.value)
  }

  delete(): void {
    if (this.parent instanceof BaseModel && this.parent.type === 'list') {
      this.parent.delete(this.id)
    }
  }

  toString(): string {
    return toStr(this.data())
  }
}