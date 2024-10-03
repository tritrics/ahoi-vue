import { has, isStr, isObj } from '../../utils'
import { BaseStore } from '../index'
import type { Object, IBaseStore } from '../../types'

/**
 * Map holding all stores.
 */
export const storesMap: Object = {}

/**
 * Get, register or implicitely create a store.
 */
export function stores(name?: string, data?: Object|IBaseStore): IBaseStore|Object {

  // no name given, return all stores
  if (!isStr(name, 1)) {
    return storesMap
  }
  
  // create store
  if (!has(storesMap, name)) {
    if (data instanceof BaseStore) {
      storesMap[name] = data
    } else {
      storesMap[name] = new BaseStore(isObj(data) ? data : {})
    }
  }

  // return store
  return storesMap[name]
}