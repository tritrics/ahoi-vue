import { ref, watch, toRef } from 'vue'
import { each, has, isArr, isStr, isTrue, isFalse, isEmpty } from '../fn'
import type { IStore } from './types'
import type { Object } from '../types'
import type { Ref, WatchCallback, WatchOptions, WatchStopHandle } from 'vue'

/**
 * Simple store.
 */
class Store implements IStore {

  /**
   * Object with store values.
   */
  _data: Object = {}

  /**
   * Getting an option as value.
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
    return has(this._data, key) && isTrue(this._data[key].value)
  }

  /**
   * Checking a boolean value.
   */
  isFalse(key: string): boolean {
    return has(this._data, key) && isFalse(this._data[key].value)
  }

  /**
   * Checking empty value.
   */
  isEmpty(key: string): boolean {
    return has(this._data, key) && isEmpty(this._data[key].value)
  }

  /**
   * Getting an option as ref.
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
  set(key: string, val?: any): void {
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

export default Store