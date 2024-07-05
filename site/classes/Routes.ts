import { each, has, count, upperFirst, isStr, isObj } from '../../fn'
import type { RouteRecordRaw } from 'vue-router'
import type { IRoutes, IRouterOptions, IRouteOptions, IRouteNormalized } from "../types"
import type { Object } from '../../types'

export default class Routes implements IRoutes {

  /**
   * Default route must always be defined.
   * Default route is always used, if not specific route can be found.
   * This route is not the same as a default-blueprint route in #blueprints.
   */
  #default: IRouteNormalized

  /**
   * Optional defined route for not-found pages.
   */
  #notfound: IRouteNormalized

  /**
   * Map with routes for special blueprints.
   */
  #blueprints: {
    [ key: string ]: IRouteNormalized
  } = {}

  /** */
  constructor (options: IRouterOptions) {

    // default route must always exist
    const defaultRoute = this.#getRouteDefNormalized(options.default)
    if (!defaultRoute) {
      throw new Error('Router configuration needs at least a default route')
    }
    this.#default = defaultRoute

    // notfound route
    const notfoundRoute = this.#getRouteDefNormalized(options.notfound)
    this.#notfound = notfoundRoute ?? this.#default

    // optional mapping blueprints to routes
    const blueprints: Object = {}
    if (isObj(options.blueprints)) {
      each(options.blueprints, (def: IRouteOptions, blueprint: string) => {
        const record = this.#getRouteDefNormalized(def)
        if (record) {
          blueprints[blueprint] = record
        }
      })
      this.#blueprints = blueprints
    }
  }

  /**
   * Getting a route for a given blueprint.
   * Returnes default-route, if no specific route for blueprint is defined or
   * notfound-route, if blueprint is false.
   */
  get(blueprint: string|false, path: string, meta: Object = {}): RouteRecordRaw {
    if (blueprint === false || !isStr(blueprint, 1)) {
      return this.#getRoute(this.#notfound, 'notfound', path, meta)
    } else if (has(this.#blueprints, blueprint)) {
      return this.#getRoute(this.#blueprints[blueprint], blueprint, path, meta)
    }
    return this.#getRoute(this.#default, blueprint, path, meta)
  }

  /**
   * Creating the route for use in router.
   */
  #getRoute(def: IRouteNormalized, blueprint: string, path: string, meta: Object): RouteRecordRaw {
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