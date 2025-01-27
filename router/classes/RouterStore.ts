import { createWebHashHistory, createWebHistory, createMemoryHistory } from 'vue-router'
import { each, has, count, inArr, isStr, isBool, isObj, isUrl, isFn, isInt, isEmpty, isArr, toKey, toBool, toInt } from '../../utils'
import { installedRouter } from '../index'
import { ImmutableStore, mainStore } from '../../plugin'
import type { RouteRecordRaw, RouterHistory  } from 'vue-router'
import type { IRouterStore, IRouteOptions, IRouteNormalized, IRouteMap } from '../types'
import type { Object } from '../../types'

/**
 * Store width language terms.
 */
class RouterStore extends ImmutableStore implements IRouterStore {

  /**
   * normalized blueprint definitions from config
   * default: IRouteNormalized|null = null
   */
  #blueprints: IRouteMap = {}

  /**
   * timestamp of routing start in milliseconds
   */
  #routeStart: number = 0

  /** */
  constructor() {
    super({

      // router configuration
      type: 'dynamic-load',
      history: 'hash',
      scroll: false,
      overlayDelay: 500,
      overlayMin: 500,

      // router status
      url: null,
      init: false,
      loading: false,
      overlay: false
    })
  }

  /**
   * Router Hooks
   */
  beforeEach(): void {
    this._set('loading', true)

    // Overlay handling
    if (this.isTrue('init') && this.#routeStart === 0) {
      this.#routeStart = Date.now()
      setTimeout(() => {
        if (this.#routeStart > 0) {
          this._set('overlay', true)
        }
      }, this.get('overlayDelay'))
    }
  }

  async beforeResolve(): Promise<void> {
    this._set('loading', false)

    // Overlay handling
    // Overlay is shown with a delay (@see beforeEach) and is always shown
    // a minimum duration.
    if (this.isTrue('init') && this.#routeStart > 0) {
      const delay = this.get('overlayDelay')
      const min = this.get('overlayMin')
      const duration = Date.now() - this.#routeStart
      this.#routeStart = 0
      if (this.is('overlay', true) && (duration - delay) <= min) {
        return new Promise(resolve => setTimeout(resolve, (min - (duration - delay)))).then(() => {
          this._set('overlay', false)
        })
      }
    }

    // default
    this._set('overlay', false)
    return Promise.resolve()
  }
  
  /**
   * Initialization
   */
  async init(): Promise<void> {

    // get user-values from options
    const config = mainStore.get('addons.router')
    this._setType(config.type)
    this._setHistory(config.history)
    this._setScroll(config.scroll)
    this._setOverlayDelay(config.overlayDelay)
    this._setOverlayMin(config.overlayMin)

    // default route must always exist
    const defaultRoute = this.#getRouteDefNormalized('default', config.blueprints.default)
    if (!defaultRoute) {
      throw new Error('[AHOI] Router configuration needs at least a default route')
    }
    this.#blueprints.default = defaultRoute

    // optional mapping blueprints to routes
    if (isObj(config.blueprints)) {
      each(config.blueprints, (def: IRouteOptions, blueprint: string) => {
        if (blueprint !== 'default') {
          const record = this.#getRouteDefNormalized(blueprint, def, defaultRoute.meta)
          if (record) {
            this.#blueprints[blueprint] = record
          }
        }
      })
    }
  }

  /**
   * Get fields for page request for a given blueprint.
   */
  getFields(blueprint: string|false): string[]|'*' {
    if (isStr(blueprint, 1) && has(this.#blueprints, blueprint)) {
      return this.#blueprints['blueprint'].meta.fields
    }
    return '*'
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
   * error-route, if blueprint is false.
   */
  getRouteRecord(blueprint: string|false, path: string, meta: Object = {}): RouteRecordRaw {
    if (isStr(blueprint, 1) && has(this.#blueprints, blueprint)) {
      return this.#getRouteHelper(this.#blueprints[blueprint], path, meta)
    }
    return this.#getRouteHelper(this.#blueprints.default as IRouteNormalized, path, meta)
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
   * Setter overlay minimum visibility time (milliseconds)
   */
  _setOverlayMin(val: any): void {
    if (isInt(val, 0)) {
      this._set('overlayMin', toInt(val))
    }
  }

  /**
   * Setter overlay delay (milliseconds)
   */
  _setOverlayDelay(val: any): void {
    if (isInt(val, 0)) {
      this._set('overlayDelay', toInt(val))
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
    if (isStr(val) && inArr(val, installedRouter)) {
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
    return {
      path,
      name: 'dynamic',
      meta: { ...def.meta, ...meta },
      components: def.components
    }
  }

  /**
   * Helper to transform the option given route to a normlized route.
   */
  #getRouteDefNormalized(blueprint: string, def: IRouteOptions|undefined, defaultMeta: Object = {}): IRouteNormalized|undefined {
    const res: Object = {
      meta: { ...defaultMeta },
      components: {}
    }

    // route defintion is a function
    if (isFn(def)) {
      res.components.default = def
      return res as IRouteNormalized
    }

    // route defintion is an object
    if (isObj(def)) {

      // route has component
      if (has(def, 'component') && isFn(def.component)) {
        res.components.default = def.component
      }
      
      // OR route has components
      else if (has(def, 'components')) {
        each (def.components, (importFn: any, name: string) => {
          if (isStr(name, 1) && isFn(importFn)) {
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
      res.meta.blueprint = blueprint
      if (!has(res.meta, 'fields') || !isArr(res.meta.fields)) {
        res.meta.fields = '*'
      }
      return res as IRouteNormalized
    }
  }
}

export default RouterStore