import { has, each, isStr, isObj } from '../../fn'
import { BaseStore } from '../index'
import type { Object, IBaseStore } from '../../types'

/**
 * Map holding all stores.
 */
export const storesMap: Object = {}

/**
 * Get, register or implicitely create a store.
 */
export function stores(mixed: string|Object, data?: Object|IBaseStore): IBaseStore {

  // no name given, data in mixed, don't register store
  if (!isStr(mixed, 1)) {
    const store: IBaseStore = new BaseStore()
    setData(store, mixed)
    return store
  }
  
  // create store
  if (!has(storesMap, mixed)) {
    if (data instanceof BaseStore) {
      storesMap[mixed] = data
    } else {
      storesMap[mixed] = new BaseStore()
      setData(storesMap[mixed], data)
    }
  }
  return storesMap[mixed]
}

/**
 * Setting initial data
 */
function setData(store: IBaseStore, data?: Object): void {
  if (isObj(data)) {
    each(data, (val: any, key: string) => {
      store.set(key, val)
    })
  }
}