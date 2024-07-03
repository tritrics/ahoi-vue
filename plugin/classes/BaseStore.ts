import { ref, watch } from 'vue'
import { each, has, count, isStr, isTrue, isFalse, isEmpty, isObj, isFunc, upperFirst } from '../../fn'
import type { Object, IBaseStore, IStoreData, IStoreDataValue } from '../../types'
import type { Ref, WatchCallback, WatchOptions, WatchStopHandle } from 'vue'

/**
 * Basic class for all stores.
 */
class BaseStore implements IBaseStore {

  /**
   * Object with store values.
   */
  #data: IStoreData = {}

  /**
   * Flag to determine, if new properties can be added by set('foo', 'bar).
   */
  get ADD_PROPERTIES(): boolean {
    return true
  }

  /** */
  constructor(initialValues: Object = {}) {
    if (isObj(initialValues)) {
      each(initialValues, (val: any, key: string) => {
        this._set(key, val) // don't use set() here
      })
    }
  }
  /**
   * Getting a value.
   */
  get(key: string): any {
    if (this.has(key)) {
      return this.#data[key].ref.value
    }
    return null
  }

  /**
   * Checking existance of a property.
   */
  has(key: string): boolean {
    return has(this.#data, key)
  }

  /**
   * Initialization AFTER all stores are ready.
   * Start watcher, request async data.
   */
  async init(): Promise<void> {
    return Promise.resolve()
  }

  /**
   * Checking equality.
   */
  is(key: string, val: any): boolean {
    return this.get(key) === val
  }

  /**
   * Checking non-equality.
   */
  isNot(key: string, val: any): boolean {
    return !this.is(key, val)
  }

  /**
   * Checking a boolean value.
   */
  isTrue(key: string): boolean {
    return isTrue(this.get(key))
  }

  /**
   * Checking a boolean value.
   */
  isFalse(key: string): boolean {
    return isFalse(this.get(key))
  }

  /**
   * Checking empty value.
   */
  isEmpty(key: string): boolean {
    return isEmpty(this.get(key))
  }

  /**
   * Getting a value as ref.
   */
  ref(key: string): Ref {
    if (this.has(key)) {
      return this.#data[key].ref
    }
    return ref(null)
  }

  /**
   * Public setter
   * Checks for special setter function or sets the value directly.
   * Check if new properties are allowed.
   */
  set(key: string, val?: any): void {
    if (isStr(key, 1)) {
      const setter: string = `_set${upperFirst(key)}`
      if (isFunc((<any>this)[setter])) {
        (<any>this)[setter](val)
      } else if (this.has(key) || this.ADD_PROPERTIES) {
        this._set(key, val)
      }
    }
  }

  /**
   * Stop all watchers at once, useful on unload component.
   */
  stop(): void {
    each(this.#data, (property: IStoreDataValue) => {
      each(property.watchstop, (stopHandle: WatchStopHandle) => {
        stopHandle()
      })
      property.watchstop = []
    })
  }

  /**
   * Watch a property or an array of properties.
   */
  watch<T>(key: string|string[], callback: WatchCallback<T>, options: WatchOptions = {}): WatchStopHandle {
    const keys = [ key ].flat().filter((key) => isStr(key, 1) && this.has(key))
    if (count(keys) === 0) {
      return () => {}
    }
    const refs: Ref<any>[] = []
    each(keys, (key: string) => {
      refs.push(this.ref(key))
    })
    const watchRefs = count(refs) === 1 ? refs[0] : refs
    const stopHandle: WatchStopHandle = watch(watchRefs, callback as WatchCallback, options)
    each(keys, (key: string) => {
      this.#data[key].watchstop.push(stopHandle)
    })
    return stopHandle
  }

  /**
   * Intern Setter
   * Always creates the property if it's not existing.
   */
  _set(key: string, val?: any): void {
    if (this.has(key)) {
      this.#data[key].ref.value = val
    } else {
      this.#data[key] =  {
        ref: ref(val),
        watchstop: []
      }
    }
  }
}

export default BaseStore