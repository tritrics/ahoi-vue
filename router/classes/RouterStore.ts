import { each, has, count, upperFirst, inArr, isStr, isBool, isObj, isUrl, isEmpty, toKey, toBool } from '../../fn'
import { installedRouterTypes } from '../index'
import { AddonStore, optionsStore } from '../../plugin'
import type { RouteRecordRaw } from 'vue-router'
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
      notfound: {},
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

    // notfound route
    const notfoundRoute = this.#getRouteDefNormalized(def.notfound)
    this._set('notfound', notfoundRoute ?? defaultRoute)

    // optional mapping blueprints to routes
    const blueprints: Object = {}
    if (isObj(def.blueprints)) {
      each(def.blueprints, (def: IRouteOptions, blueprint: string) => {
        const record = this.#getRouteDefNormalized(def)
        if (record) {
          blueprints[blueprint] = record
        }
      })
      this._set('blueprints', blueprints)
    }
  }

  /**
   * Getting a route for a given blueprint.
   * Returnes default-route, if no specific route for blueprint is defined or
   * notfound-route, if blueprint is false.
   */
  getRoute(blueprint: string|false, path: string, meta: Object = {}): RouteRecordRaw {
    if (blueprint === false || !isStr(blueprint, 1)) {
      return this.#getRouteHelper(this.get('notfound'), 'notfound', path, meta)
    } else if (this.has(`blueprints.${blueprint}`)) {
      return this.#getRouteHelper(this.get(`blueprints.${blueprint}`), blueprint, path, meta)
    }
    return this.#getRouteHelper(this.get('default'), blueprint, path, meta)
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
  #getRouteHelper(def: IRouteNormalized, blueprint: string, path: string, meta: Object): RouteRecordRaw {
    const res: RouteRecordRaw = {
      path,
      name: 'dynamic',
      meta: { ...def.meta, ...meta },
      components: {}
    }

    // convert components to imports, parse blueprint-name
    for(const key in def.components) {
      const parsed = this.#parseBlueprint(def.components[key], blueprint)
      res.components[key] = () => import(parsed)
    }
    return res
  }



  /**
   * Helper to transform the option given route to a normlized route.
   */
  #getRouteDefNormalized(def: IRouteOptions|undefined): IRouteNormalized|undefined {
    const res: Object = {
      meta: {},
      components: {}
    }

    // route defintion is a string
    if (isStr(def, 1)) {
      res.components.default = def
      return res as IRouteNormalized
    }

    // route defintion is an object
    if (isObj(def)) {

      // route has component
      if (has(def, 'component') && isStr(def.component, 1)) {
        res.components.default = def.component
      }
      
      // OR route has components
      else if (has(def, 'components')) {
        each (def.components, (path: string, name: string) => {
          if (isStr(name, 1) && isStr(path, 1)) {
            res.components[name] = path
          }
        })
        if (count(res.components) === 0) {
          return
        }
      } else {
        return // incorrect def
      }

      // add meta values
      each(def, (val: any, key: string) => {
        if (key !== 'component' && key !== 'components') {
          res.meta[key] = val
        }
      })
      return res as IRouteNormalized
    }
  }

  /**
   * Enables placeholer %blueprint% or %Blueprint% in components.
   */
  #parseBlueprint(path: string, blueprint: string): string {
    return path
      .replace('%blueprint%', blueprint)
      .replace('%Blueprint%', upperFirst(blueprint))  
  }
}

export default RouterStore