import { createWebHashHistory, createWebHistory, createMemoryHistory } from 'vue-router'
import { each, has, count, inArr, isStr, isBool, isObj, isUrl, isFn, isEmpty, toKey, toBool } from '../../fn'
import { installedRouterTypes } from '../index'
import { AddonStore, optionsStore } from '../../plugin'
import type { RouteRecordRaw, RouterHistory  } from 'vue-router'
import type { IRouterStore, IRouteOptions, IRouteNormalized } from '../types'
import type { Object } from '../../types'

/**
 * Store width language terms.
 */
class RouterStore extends AddonStore implements IRouterStore {

  /** */
  constructor() {
    super({

      // router configuration
      type: 'dynamic-load',
      history: 'hash',
      scroll: false,
      default: {},
      catchall: {},
      blueprints: {},

      // router status
      url: null,
      //... add more if required
    })
  }
  
  /**
   * Initialization
   */
  async init(): Promise<void> {

    // get user-values from options
    const def = optionsStore.get('router')
    this._setType(def.type)
    this._setHistory(def.history)
    this._setScroll(def.scroll)

    // default route must always exist
    const defaultRoute = this.#getRouteDefNormalized(def.default)
    if (!defaultRoute) {
      throw new Error('AHOI Plugin: Router configuration needs at least a default route')
    }
    this._set('default', defaultRoute)

    // catchall route
    const catchallRoute = this.#getRouteDefNormalized(def.catchall, defaultRoute.meta)
    this._set('catchall', catchallRoute ?? defaultRoute)

    // optional mapping blueprints to routes
    const blueprints: Object = {}
    if (isObj(def.blueprints)) {
      each(def.blueprints, (def: IRouteOptions, blueprint: string) => {
        const record = this.#getRouteDefNormalized(def, defaultRoute.meta)
        if (record) {
          blueprints[blueprint] = record
        }
      })
      this._set('blueprints', blueprints)
    }
  }
  
  /**
   * Get history mode
   */
  getHistoryMode(): RouterHistory {
    switch(this.get('history')) {
      case 'web':
        return createWebHistory()
      case 'memory':
        return createMemoryHistory()
      default: // 'hash'
        return createWebHashHistory()
    }
  }

  /**
   * Getting a route-defintion (for router) for a given blueprint.
   * Returnes default-route, if no specific route for blueprint is defined or
   * catchall-route, if blueprint is false.
   */
  getRoute(blueprint: string|false, path: string, meta: Object = {}): RouteRecordRaw {
    if (blueprint === false || !isStr(blueprint, 1)) {
      return this.#getRouteHelper(this.get('catchall'), path, meta)
    } else if (this.has(`blueprints.${blueprint}`)) {
      return this.#getRouteHelper(this.get(`blueprints.${blueprint}`), path, meta)
    }
    return this.#getRouteHelper(this.get('default'), path, meta)
  }

  /**
   * Setter history mode
   */
  _setHistory(val: any): void {
    val = toKey(val)
    if (isStr(val) && inArr(val, ['web', 'memory', 'hash' ])) {
      this._set('history', val)
    }
  }

  /**
   * Setter router scroll
   */
  _setScroll(val: any): void {
    if (isBool(val, false)) {
      this._set('scroll', toBool(val))
    }
  }

  /**
   * Setter for router-type
   */
  _setType(val: any): void {
    val = toKey(val)
    if (isStr(val) && inArr(val, installedRouterTypes)) {
      this._set('type', val)
    }
  }

  /**
   * Setter for router-type
   */
  _setUrl(val: any): void {
    if (isUrl(val) || isEmpty(val)) {
      this._set('url', val)
    }
  }

  /**
   * Creating the route for use in router.
   */
  #getRouteHelper(def: IRouteNormalized, path: string, meta: Object): RouteRecordRaw {
    const res: RouteRecordRaw = {
      path,
      name: 'dynamic',
      meta: { ...def.meta, ...meta },
      components: def.components
    }
    return res
  }

  /**
   * Helper to transform the option given route to a normlized route.
   */
  #getRouteDefNormalized(def: IRouteOptions|undefined, defaultMeta: Object = {}): IRouteNormalized|undefined {
    const res: Object = {
      meta: { ...defaultMeta },
      components: {}
    }

    // route defintion is a function
    if (isFn(def, 1)) {
      res.components.default = def
      return res as IRouteNormalized
    }

    // route defintion is an object
    if (isObj(def)) {

      // route has component
      if (has(def, 'component') && isFn(def.component, 1)) {
        res.components.default = def.component
      }
      
      // OR route has components
      else if (has(def, 'components')) {
        each (def.components, (importFn: any, name: string) => {
          if (isStr(name, 1) && isFn(importFn, 1)) {
            res.components[name] = importFn
          }
        })
        if (count(res.components) === 0) {
          return
        }
      } else {
        return // incorrect def
      }

      // add meta values, overwrite defaultMeta
      each(def, (val: any, key: string) => {
        if (key !== 'component' && key !== 'components') {
          res.meta[key] = val
        }
      })
      return res as IRouteNormalized
    }
  }
}

export default RouterStore