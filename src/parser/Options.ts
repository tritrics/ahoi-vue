import { each, has, clone, merge, isObj } from '../fn'
import type { Object } from '../types'

/**
 * Options for parser plugin
 */
class Options {

  /**
   * Options
   */
  options: Object = {}

  /**
   * Default values for options
   */
  optionsDefault: Object = {
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
  constructor(options: Object = {}) {
    this.init(options)
  }

  /**
   * Setter
   */
  set(field: string, prop: string, value: any): void {
    if (has(this.optionsDefault, field, prop) || field === 'html') {
      if (!isObj(this.options[field][prop])) {
        this.options[field]![prop] = value
      } else if (isObj(value)) {
        this.options[field]![prop] = merge(this.options[field][prop], value)
      }
    }
  }

  /**
   * Get a specific option from this.options or optionally return 
   * the user-given option.
   */
  get(field: string, prop: string, user: Object = {}): any {
    if (has(this.options, field, prop) && has(user, prop)) {
      if (isObj(this.options[field][prop])) {
        return merge(clone(this.options[field][prop]), user[prop])
      }
      return user[prop]
    } else if (has(this.options, field, prop)) {
      return this.options[field][prop]
    } else if (has(user, prop)) {
      return user[prop]
    }
    return null
  }

  /**
   * Init options
   */
  init(options: Object = {}): void {
    this.options = clone(this.optionsDefault)
    each(options, (props: Object, field: string) => {
      if (isObj(props)) {
        each(props, (value: any, prop: string) => {
          this.set(field, prop, value)
        })
      }
    })
  }
}

export default Options
