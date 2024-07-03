import { has, isStr, isObj } from '../../fn'
import { BaseStore, UserStore } from '../index'
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
    return new UserStore(isObj(mixed) ? mixed : {})
  }
  
  // create store
  if (!has(storesMap, mixed)) {
    if (data instanceof BaseStore) {
      storesMap[mixed] = data
    } else {
      storesMap[mixed] = new UserStore(isObj(data) ? data : {})
    }
  }

  // return store
  return storesMap[mixed]
}