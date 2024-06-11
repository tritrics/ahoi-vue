import { ref, watch, toRef } from 'vue'
import { each, has, isArr, isStr, isTrue, isFalse, isEmpty } from '../../fn'
import type { Object, IBaseStore } from '../../types'
import type { Ref, WatchCallback, WatchOptions, WatchStopHandle } from 'vue'

/**
 * Simple store.
 */
class BaseStore implements IBaseStore {

  /**
   * The options given by user.
   */
  _options: Object = {}

  /**
   * Object with store values.
   */
  _data: Object = {}

  /**
   * Init store.
   * Is called, after all store instances have been created.
   */
  async init(options: Object = {}): Promise<void> {
    this._options = options ?? {}
  }

  /**
   * Getting a value.
   */
  get(key: string): any {
    if (has(this._data, key)) {
      return this._data[key].value
    }
    return null
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
    if (!has(this._data, key)) {
      this.set(key, null)
    }
    return toRef(this._data[key])
  }

  /**
   * Setter
   */
  async set(key: string, val?: any): Promise<void> {
    if (isStr(key, 1)) {
      if (has(this._data, key)) {
        this._data[key].value = val
      } else {
        this._data[key] = ref(val)
      }
    }
  }

  /**
   * Watch a pref or an array of prefs.
   */
  watch<T>(keys: string|string[], callback: WatchCallback<T>, options: WatchOptions = {}): WatchStopHandle {
    let sources: Ref<string>[] = []
    if (isArr(keys)) {
      each(keys, (key: string) => {
        if (!has(this._data, key)) {
          this.set(key, null)
        }
        sources.push(this._data[key])
      })
    } else if(isStr(keys, 1)) {
      if (!has(this._data, keys)) {
        this.set(keys, null)
      }
      sources = this._data[keys]
    }
    return watch(sources, callback as WatchCallback, options)
  }
}

export default BaseStore