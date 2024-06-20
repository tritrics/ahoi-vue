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
    this.set('action', options.action)
    this.set('lang', options.lang)
    this.set('fields', options.fields)
    this.set('immediate', options.immediate)
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
   * Special getter for field values.
   */
  getFieldValues(): IFormParams {
    const res: IFormParams = {}
    each(this.get('fields'), (field: IBaseModel, key: string) => {
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
          super.set('action', val)
        }
        break
      case 'fields':
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
          super.set('fields', fields)
        }
        break
      case 'lang':
        if (isStr(val, 1)) {
          super.set('lang', val)
        }
        break
      case 'immediate':
        if (isBool(val, false)) {
          const immediate = toBool(val)
          super.set('immediate', immediate)
          each(this.get('fields'), (field: IBaseModel) => {
            field.watch(immediate) // watch on/off
          })
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
    super.set('processing', true)
    const res = await postCreate(action, this.getFieldValues(), options)
    super.set('processing', false)
    return res
  }

  /**
   * Reset form
   */
  async reset(): Promise<void> {
    const options = this.get('options')
    super.set('processing', false)
    this.set('immediate', false) // stop watching old fields
    this.set('action', options.action)
    this.set('lang', options.lang)
    this.set('fields', options.fields)
    this.set('immediate', options.immediate)
  }

  /**
   * Validation of all fields and also switch the immediate setting
   */
  validate(immediate: boolean = false): void {
    each(this.get('fields'), (field: IBaseModel) => {
      field.validate()
    })
    this.set('immediate', immediate)
  }
}

export default FormStore