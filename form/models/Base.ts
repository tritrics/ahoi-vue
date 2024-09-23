import { watchEffect } from 'vue'
import { toStr, isEmpty, uuid, has, isTrue } from '../../fn'
import type { FormModelTypes, IFormBaseModel, IFormListModel } from '../types'
import type { Object, FormPostValue } from "../../types"

/**
 * Base model
 */
export default class BaseModel implements IFormBaseModel {

  /**
   * Type
   */
  type: FormModelTypes = 'base'

  /**
   * Unique id for every model
   */
  id: string 

  /**
   * The raw (unvalidated) input value
   */
  value: any
  
  /**
   * Flag to determine, if input is required
   */
  required: boolean

  /**
   * Flag to check if value is valid
   */
  valid: boolean = true
  
  /**
   * Error message in case of invalid value
   */
  msg: string = ''

  /**
   * Stop function for validation watcher
   */
  stop: Function|null = null

  /**
   * Optional parent model for childs of list models
   */
  parent?: IFormListModel
  
  /** */
  constructor(def: Object, parent?: IFormListModel) {
    this.id = uuid()
    this.value = has(def, 'value') ? toStr(def.value) : ''
    this.required = has(def, 'required') && isTrue(def.required, false) ? true : false
    if(parent instanceof BaseModel && parent.type === 'list') { // ListModel due to circular referenciation not possible here
      this.parent = parent
    }
  }

  /**
   * Delete method for childs of list models 
   */
  delete(): void {
    if (this.parent instanceof BaseModel && this.parent.type === 'list') {
      this.parent.delete(this.id)
    }
  }

  /**
   * Getter for value for use in post data
   */
  get(): FormPostValue {
    return toStr(this.value)
  }

  /**
   * Setter for value
   */
  set(value: any): void {
    this.value = value
  }

  /** */
  toString(): string {
    return toStr(this.get())
  }

  /**
   * Type- and required-validation
   * val important to kick off the watchEffect
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(val?: any): void {
    return this._setValid()
  }

  /**
   * Watcher to start validation
   */
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

  /**
   * Setter for result of validation
   */
  _setValid(msg: string = ''): void {
    this.valid = isEmpty(msg)
    this.msg = msg
  }
}