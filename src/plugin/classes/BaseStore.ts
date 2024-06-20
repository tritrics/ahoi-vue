import { ref } from 'vue'
import { each, has, uuid, unset, count, isStr, isTrue, isFalse, isEmpty, isObj } from '../../fn'
import type { Object, IBaseStore, IStoreData, IWatchOptions, IWatchDefintion, IWatchCallback, IWatchStop } from '../../types'
import type { Ref } from 'vue'

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
        this.#addProperty(key, val) // don't use set() here
      })
    }
  }

  /**
   * Adding a property to data store.
   */
  #addProperty(key: string, val: any): void {
    this.#data[key] = {
        ref: ref(val),
        observer: []
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
   * Setter
   */
  async set(key: string, val?: any): Promise<void> {
    let oldVal: any = undefined
    if (isStr(key, 1)) {
      if (this.has(key)) {
        oldVal = this.#data[key].ref.value
        this.#data[key].ref.value = val
      } else if (this.ADD_PROPERTIES) {
        this.#addProperty(key, val)
      }
      await this.#watchCall(key, val, oldVal)
    }
  }

  /**
   * Stop all watchers at once, useful on unload component.
   */
  stop(): void {
    each(this.#data, (property: Object) => {
      property.observer = {}
    })
  }

  /**
   * Watch a property or an array of properties.
   * Here we don't use Vue's watch(), because with this implementation we can wait
   * for asynchrous callbacks.
   */
  async watch(key: string|string[], callback: IWatchCallback, options: IWatchOptions = {}): Promise<IWatchStop> {
    const keys = [ key ].flat().filter((key) => isStr(key, 1) && this.has(key))
    const promises: Promise<void>[] = []
    if (count(keys) === 0) {
      return () => {}
    }
    const id = uuid()
    each(keys, (key: string) => {
      const watcher: IWatchDefintion = {
        id,
        callback,
        options
      }
      this.#data[key].observer.push(watcher)
      if (isTrue(options.immediate)) {
        promises.push(callback(this.get(key), undefined, options.payload))
      }
    })
    await Promise.all(promises)
    return () => this.#watchStop(keys, id)
  }

  async #watchCall(key: string, newVal: any, oldVal?: any): Promise<void> {
    const promises: Promise<void>[] = []
    for (let i = 0; i < this.#data[key].observer.length; i++) {
      promises.push(this.#data[key].observer[i].callback(
        newVal,
        oldVal,
        this.#data[key].observer[i].options.payload
      ))
    }
    await Promise.all(promises)
  }

  /**
   * Stop a watcher.
   * Function is always applied with valid keys.
   */
  #watchStop(keys: string|string[], id: string): void {
    each(keys, (key: string) => {
      for (let i = 0; i < this.#data[key].observer.length; i++) {
        if (this.#data[key].observer[i].id === id) {
          return unset(this.#data[key].observer, i)
        }
      }
    })
  }
}

export default BaseStore