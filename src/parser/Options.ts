import { each, has, clone, merge, isObj } from '../fn'
import type { Object } from '../types'

/**
 * Options for parser plugin
 */
class Options {

  /**
   * Params
   */
  params: Object = {}

  /**
   * Default values for params
   */
  paramsDefault: Object = {
    global: {
      locale: null
    },
    number: {
      fixed: null
    },
    link: {
      router: false
    },
    html: {},
    text: {
      nl2br: false
    },
    date: {
      format: { year: 'numeric', month: 'numeric', day: 'numeric' }
    },
    time: {
      format: { hour: '2-digit', minute: '2-digit' }
    }
  }

  /**
   */
  constructor(params: Object = {}) {
    this.init(params)
  }

  /**
   * Setter
   */
  set(field: string, prop: string, value: any): void {
    if (has(this.paramsDefault, field, prop) || field === 'html') {
      if (!isObj(this.params[field][prop])) {
        this.params[field]![prop] = value
      } else if (isObj(value)) {
        this.params[field]![prop] = merge(this.params[field][prop], value)
      }
    }
  }

  /**
   * Get a specific option from this.params or optionally return 
   * the user-given option.
   */
  get(field: string, prop: string, user: Object = {}): any {
    if (has(this.params, field, prop) && has(user, prop)) {
      if (isObj(this.params[field][prop])) {
        return merge(clone(this.params[field][prop]), user[prop])
      }
      return user[prop]
    } else if (has(this.params, field, prop)) {
      return this.params[field][prop]
    } else if (has(user, prop)) {
      return user[prop]
    }
    return null
  }

  /**
   * Init Params
   */
  init(params: Object = {}): void {
    this.params = clone(this.paramsDefault)
    each(params, (props: Object, field: string) => {
      if (isObj(props)) {
        each(props, (value: any, prop: string) => {
          this.set(field, prop, value)
        })
      }
    })
  }
}

export default Options
