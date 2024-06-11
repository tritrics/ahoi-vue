
import { ref, computed } from 'vue'
import { count, each, has, toKey, isBool, isObj, isStr, toBool } from '../../fn'
import { BaseStore, postCreate } from '../../plugin'
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
class FormStore extends BaseStore implements IFormStore {

  /**
   * Object with store values.
   */
  _data: Object = {

    /**
     * Input fields (instances of models)
     */
    fields: ref<{[index: string]: IBaseModel}>({}),

    /**
     * The action (path) to submit the form.
     */
    action: ref<string>(),

    /**
     * The language for the submit.
     */
    lang: ref<string>(),

    /**
     * Flag to set immediate validation on/off.
     */
    immediate: ref<boolean>(false),

    /**
     * True while waiting for answer from API.
     */
    processing: ref<boolean>(false),
  }

  /**
   * Overall valid flag
   */
  valid = computed<boolean>(() => {
    let res: boolean = true
    each(this._data.fields.value, (field: IBaseModel) => {
      if (!field.valid) {
        res = false
      }
    })
    return res
  })

  /**
   * Init store/form.
   */
  async init(options: IFormOptions = {}): Promise<void> {
    if (isObj(options) && count(options) > 0) {
      this._options = options
      this.set('action', options.action ?? null)
      this.set('lang', options.lang ?? null)
      this.set('immediate', options.immediate ?? false)
    }
    if (!has(this._options, 'fields')) {
      this._options.fields = {}
    }
    each(this._data.fields.value, (field: IBaseModel) => {
      field.watch(false)
    })
    this._data.fields.value = {}
    this._data.processing.value = false
    each(this._options.fields, (def: Object, key: string) => {
      const type = toKey(def.type) ?? 'base'
      if (modelsMap[type] !== undefined) {
        this._data.fields.value[key] = new modelsMap[type](def)
      } else {
        this._data.fields.value[key] = new BaseModel(def)
      }
    })
    if (this._data.immediate.value) {
      each(this._data.fields.value, (field: IBaseModel) => {
        field.watch(true)
      })
    }
  }

  /**
   * Special getter for field values.
   */
  getFieldValues(): IFormParams {
    const res: IFormParams = {}
    each(this._data.fields.value, (field: IBaseModel, key: string) => {
      res[key] = field.data()
    })
    return res
  }

  /**
   * Setter.
   */
  async set(key: string, val?: any): Promise<void> {
    switch(key) {
      case 'action':
        if (isStr(val, 1)) {
          this._data.action.value = val
        }
        break
      case 'lang':
        if (isStr(val, 1)) {
          this._data.lang.value = val
        }
        break
      case 'immediate':
        if (isBool(val, false)) {
          this._data.immediate.value = toBool(val)
        }
        break
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
    const lang = this.get('lang')
    if (isStr(lang, 1)) {
      options.lang = lang
    }
    this._data.processing.value = true
    const res = await postCreate(action, this.getFieldValues(), options)
    this._data.processing.value = false
    return res
  }

  /**
   * Validation of all fields and also switch the immediate setting
   */
  validate(immediate: boolean = false): void {
    if (isBool(immediate, false)) {
      this._data.immediate.value = toBool(immediate)
    }
    each(this._data.fields.value, (field: IBaseModel) => {
      field.validate()
      field.watch(this._data.immediate)
    })
  }
}

export default FormStore