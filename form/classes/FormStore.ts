import { watchEffect } from 'vue'
import { each, toKey, isBool, isObj, isStr, toBool, toInt, isTrue } from '../../utils'
import { ImmutableStore, postCreate } from '../../plugin'
import BaseModel from '../models/Base'
import * as models from '../models/models'
import type { IFormBaseModel } from '../types'
import type { Object, IFormOptions, IFormParams, JSONObject, IFormStore } from '../../types'

/**
 * workaround to add types to models
 */
const modelsMap: Object = models

/**
 * Store with plugin and addons options.
 */
class FormStore extends ImmutableStore implements IFormStore {

  /**
   * Stop function for validation watcher
   */
  _watchStop: Function|null = null

  /** */
  constructor(setupOptions: IFormOptions = {}) {
    const options: IFormOptions = isObj(setupOptions) ? setupOptions : {}
    super({
      options: options,
      fields: {},
      action: '',
      lang: '',
      valid: true,
      immediate: false,
      processing: false,
      errno: 0, // error code of LAST submit(), 0 = OK
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
    each(this.get('fields'), (field: IFormBaseModel, key: string) => {
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
   * Send the field values to API
   */
  async submit(
    validate: 'immediate'|boolean = true,
    resetOnSuccess: boolean = true
  ) : Promise<JSONObject> {

    // validation
    const immediate = toKey(validate) === 'immediate'
    if (isTrue(validate) || immediate) {
      this.validate(immediate)
      if (this.isFalse('valid')) {
        this._set('errno', 100)
        return Promise.resolve({})
      }
    }

    const options: Object = {}
    this._set('processing', true)
    const action = this.get('action')
    const res = await postCreate([ this.get('lang'), action], this.getFieldValues(), options)
    this._set('processing', false)

    /**
     * @see: ActionService.php
     * Fatal errors: 1 - 99
     * Non-fatal errors: >= 100
     * Field-value validation: 100
     */
    const errno = toInt(res?.body?.errno) ?? 1
    this._set('errno', errno)
    if (errno === 0 && isTrue(resetOnSuccess)) {
      this.reset()
    }
    return Promise.resolve(res)
  }

  /**
   * Validation of all fields and also switch the immediate setting
   */
  validate(immediate?: boolean): void {
    let valid: boolean = true
    each(this.get('fields'), (field: IFormBaseModel) => {
      field.validate()
      if (!field.valid) {
        valid = false
      }
    })
    this._set('valid', valid)
    if (isBool(immediate)) {
      this._setImmediate(immediate)
    }
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
   * Setter for immediate flag, watch/unwatch fields' valid flag
   */
  _setImmediate(val: any): void {
    const immediate = toBool(val)
    this._set('immediate', immediate)
    if (immediate) {
      each(this.get('fields'), (field: IFormBaseModel) => {
        field.watch(true) // field watch on
      })
      if(this._watchStop === null) { // overall valid flag watch on
        this._watchStop = watchEffect(() => {
          this.validate()
        })
      }
    } else if (this._watchStop !== null) {
      this._watchStop() // overall valid flag watch on
      this._watchStop = null
      each(this.get('fields'), (field: IFormBaseModel) => {
        field.watch(false) // field watch off
      })
    }
  }
}

export default FormStore