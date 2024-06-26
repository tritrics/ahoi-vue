import { ref, computed } from 'vue'
import { createAction } from '../api'
import { each, has, toKey, isBool, isTrue, isObj, isStr, toBool } from '../fn'
import BaseModel from './models/Base'
import * as models from './models/models'
import type { IBaseModel } from './models/types'
import type { Object, IFormOptions, IFormParams, JSONObject } from '../types'

/**
 * workaround to add types to models
 */
const modelsMap: Object = models

class Form {

  /**
   * The field definitions like given in constructor or from API.
   * Used to reset the form.
   */
  defs: Object = {}

  /**
   * List of field with all properties
   */
  fields = ref<{[index: string]: IBaseModel}>({})

  /**
   * Plugin-options
   */
  options = ref<IFormOptions>({
    // action
    // lang
    immediate: false,
  })

  /**
   * Validation on input or only after validation() was called.
   */
  onInput = ref<boolean>(false)

  /**
   * Overall valid flag
   */
  valid = computed<boolean>(() => {
    let res: boolean = true
    each(this.fields.value, (field: IBaseModel) => {
      if (!field.valid) {
        res = false
      }
    })
    return res
  })

  /**
   * Flat, true while waiting for answer from API
   */
  processing = ref<boolean>(false)

  /**
   */
  constructor(options: IFormOptions = {}, fields: Object|null = null) {
    this.setOptions(options)
    if(isObj(fields)) {
      this.defs = fields
    } else if(isStr(this.options.value.action)) {
      this.defs = this.getFieldDefFromApi()
    } else {
      this.defs = {}
    }
    this.initForm()
  }

  /**
   * Setting options
   */
  setOptions(options: IFormOptions): void {
    if (isObj(options)) {
      if (has(options, 'action') && isStr(options.action, 1)) {
        this.options.value.action = toKey(options.action)
      }
      if (has(options, 'lang') && isStr(options.lang, 1)) {
        this.options.value.lang = toKey(options.lang)
      }
      if (has(options, 'immediate') && isBool(options.immediate, false)) {
        this.options.value.immediate = toBool(options.immediate)
      }
    }
  }

  /**
   * Request field definition from blueprint by given action
   * @TODO: request from Kirby
   */
  getFieldDefFromApi(): Object {
    return {}
  }

  /**
   * Init all fields
   */
  initForm(): void {
    this.fields.value = {}
    this.onInput.value = isTrue(this.options.value.immediate)
    this.processing.value = false
    each(this.defs, (def: Object, key: string) => {
      const type = toKey(def.type) ?? 'base'
      if (modelsMap[type] !== undefined) {
        this.fields.value[key] = new modelsMap[type](def)
      } else {
        this.fields.value[key] = new BaseModel(def)
      }
    })
    if (this.onInput.value) {
      each(this.fields.value, (field: IBaseModel) => {
        field.watch(true)
      })
    }
  }

  /**
   * Validation of all fields and also switch the immediate setting
   */
  validate(onInput: boolean = false): void {
    if (isBool(onInput)) {
      this.onInput.value = toBool(onInput)
    }
    each(this.fields.value, (field: IBaseModel) => {
      field.validate()
      field.watch(this.onInput.value)
    })
  }

  /**
   * Get values from fields in their native type (number, string, array)
   */
  data(): IFormParams {
    const res: IFormParams = {}
    each(this.fields.value, (field: IBaseModel, key: string) => {
      res[key] = field.data()
    })
    return res
  }

  /**
   * Send the field values to API
   */
  async submit(): Promise<JSONObject> {
    if (!has(this.options.value, 'action') || !isStr(this.options.value.action, 1)) {
      return Promise.resolve({} as JSONObject)
    }
    const options: Object = {}
    if (has(this.options.value, 'lang') && isStr(this.options.value.lang, 1)) {
      options.lang = this.options.value.lang
    }
    this.processing.value = true
    const res = await createAction(this.options.value.action, this.data(), options)
    this.processing.value = false
    return res
  }

  /**
   * Reset the field values
   */
  reset(): void {
    each(this.fields.value, (field: IBaseModel) => {
      field.watch(false)
    })
    this.initForm()
  }
}
export default Form 