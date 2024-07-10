import { computed } from 'vue'
import { each, toKey, isBool, isObj, isStr, toBool } from '../../fn'
import { AddonStore, postCreate } from '../../plugin'
import BaseModel from '../models/Base'
import * as models from '../models/models'
import type { IBaseModel } from '../models/types'
import type { Object, IFormOptions, IFormParams, JSONObject, IFormStore } from '../../types'

/**
 * workaround to add types to models
 */
const modelsMap: Object = models

/**
 * Store with plugin and addons options.
 */
class FormStore extends AddonStore implements IFormStore {

  /** */
  constructor(formOptions: IFormOptions = {}) {
    const options: IFormOptions = isObj(formOptions) ? formOptions : {}
    super({
      options: options,
      fields: {},
      action: '',
      lang: '',
      immediate: false,
      processing: false,
    })
    this._setAction(options.action)
    this._setLang(options.lang)
    this._setFields(options.fields)
    this._setImmediate(options.immediate)
  }

  /**
   * Special getter for field values.
   */
  getFieldValues(): IFormParams {
    const res: IFormParams = {}
    each(this.get('fields'), (field: IBaseModel, key: string) => {
      res[key] = field.get()
    })
    return res
  }

  /**
   * Reset form
   */
  reset(): void {
    const options = this.get('options')
    this._set('processing', false)
    this._setImmediate(false) // stop watching old fields
    this._setAction(options.action)
    this._setLang(options.lang)
    this._setFields(options.fields)
    this._setImmediate(options.immediate)
  }

  /**
   * Setter for action
   */
  _setAction(val: any): void {
    if (isStr(val, 1)) {
      this._set('action', val)
    }
  }

  /**
   * Setter for fields
   * Creates the field classes
   */
  _setFields(val: any): void {
    if (isObj(val)) {
      const fields: Object = {}
      each(val, (def: Object, key: string) => {
        const type = toKey(def.type) ?? 'base'
        if (modelsMap[type] !== undefined) {
          fields[key] = new modelsMap[type](def)
        } else {
          fields[key] = new BaseModel(def)
        }
      })
      this._set('fields', fields)
    }
  }

  /**
   * Setter for lang
   */
  _setLang(val: any): void {
    if (isStr(val, 1)) {
      this._set('lang', val)
    }
  }

  /**
   * Setter for immediate flag
   */
  _setImmediate(val: any): void {
    if (isBool(val, false)) {
      const immediate = toBool(val)
      this._set('immediate', immediate)
      each(this.get('fields'), (field: IBaseModel) => {
        field.watch(immediate) // watch on/off
      })
    }
  }

  /**
   * Send the field values to API
   */
  async submit(): Promise<JSONObject> {

    // Form without action is not submittable, but may be useful for other frondend use.
    const action = this.get('action')
    if (!isStr(action, 1)) {
      return Promise.resolve({} as JSONObject)
    }
    const options: Object = {}
    this._set('processing', true)
    const res = await postCreate([ this.get('lang'), action], this.getFieldValues(), options)
    this._set('processing', false)
    return res
  }

  /**
   * Overall valid flag
   */
  valid = computed<boolean>(() => {
    let res: boolean = true
    const fields = this.ref('fields')
    each(fields.value, (field: IBaseModel) => {
      if (!field.valid) {
        res = false
      }
    })
    return res
  })

  /**
   * Validation of all fields and also switch the immediate setting
   */
  validate(immediate: boolean = false): void {
    each(this.get('fields'), (field: IBaseModel) => {
      field.validate()
    })
    this._setImmediate(immediate)
  }
}

export default FormStore