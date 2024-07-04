import { createRouter as createVueRouter, createWebHashHistory, createWebHistory, createMemoryHistory } from 'vue-router'
import { each, has, count, upperFirst, uuid, trim, isArr, isStr, toKey, toStr } from '../../fn'
import { globalStore } from '../../plugin'
import { pageStore } from '../index'
import type { Router, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import type { IRoutes, IRoutesNormalized, IRouterOptions, IRouteComponents } from "../types"

/**
 * Get history mode.
 */
export function getHistoryMode(mode: string|undefined) {
  switch(toKey(mode)) {
    case 'hash-disabled': // different History modes not supported yet
      return createWebHashHistory()
    case 'memory-disabled':
      return createMemoryHistory()
    default:
       return createWebHistory() // import.meta.env.BASE_URL
  }
}

/**
 * Home route definition
 */
function getHomeRoute(component?: string|null): RouteRecordRaw {
  return {
    path: '/',
    name: 'home',
    meta: { type: 'home' },
    component: isStr(component) ? () => import(component) : null,
    children: [],
  }
}

/**
 * Catch all route defintion
 */
function getCatchAllRoute(): RouteRecordRaw {
  return {
    path: '/:catchAll(.*)',
    name: 'cachall',
    meta: { type: 'catchall' },
    component: null,
    children: []
  }
}

/**
 * Dynmaic route definition
 */
function getDynamicRoute(path: string, component: string|null, meta: Object): RouteRecordRaw {
  return {
    path,
    name: `dynamic-${uuid()}`,
    meta: { ...meta }, // ts
    component: isStr(component) ? () => import(component) : undefined,
    children: [],
  }
}

/**
 * Normalize user given routes
 */
export function normalizeRoutes(routes: IRoutes): IRoutesNormalized {
  const res: IRoutesNormalized = {
    default: [ '' ]
  }
  each(routes, (components: string|string[], key: string) => {
    key = toKey(key)
    if (!isStr(key, 1)) return
    if (isStr(components, 1)) {
      res[key] = [ components ]
    } else if (isArr(components) && count(components) > 0) {
      res[key] = components.slice(0, 2).map(val => toStr(val)) as IRouteComponents
    }
  })
  return res
}

/**
 * Get components for blueprint.
 */
export function getComponent(routes: IRoutesNormalized, blueprint: string): IRouteComponents {
  const key = toKey(blueprint)
  const components: IRouteComponents = has(routes, key) ? routes[key] : routes.default
  return components.map((val: any) => {
    return toStr(val)
      .replace('%blueprint%', blueprint)
      .replace('%Blueprint%', upperFirst(blueprint))
  }) as IRouteComponents
}

/**
 * Loading a page from a path, select language.
 */
async function loadPage(path: string, success: string|boolean, error: string): Promise<string|boolean> {
  try {
    if (globalStore.isTrue('multilang')) {
      const url = new URL(path, window.location.href)
      globalStore.setLangFromUrl(url.href)
      await globalStore.updateStores()
    }
    await pageStore.load(path, true)
    return success
  }
  catch (err) {
    ahoi.error(`Error on loading path ${path}`, err)
    return error
  }
}

/**
 * Routine to add the dynamic routes. Routes are added as child to home.
 * If path has more slugs, a child route is added for each slug to enable the
 * routes link classes (router-link-active).
 */
function addRoutes(router: Router, path: string, components: IRouteComponents, api: boolean): void {
  const component = components.pop() as string

  // adding home
  router.addRoute(getHomeRoute(count(components) === 1 ? components[0] : null))

  // adding dynamic routes
  const slugs: string[] = trim(path, '/').split('/')
  let parent: string = 'home'
  for (let i = 0; i < slugs.length; i++) {

    // Only last child is "dynamic", the parents are "catchall" –
    // otherwise the component wont't be reloaded when navigating from /foo/bar to /foo.
    const meta: Object = {
      type: (i + 1 === slugs.length) ? 'dynamic' : 'catchall',
      api,
    }
    const route = getDynamicRoute(slugs[i], component, meta)
    router.addRoute(parent, route)
    parent = route.name as string
  }
}

/**
 * Create router plugin for dynamic routing in a multilanguage enviroment.
 * 
 * All routes, which are not given in staticRoutes are considered to be a
 * Kirby page and loaded from API into pageStore (dynamic routes).
 * 
 * Dynamic routes resolve to the component, which can be either a path
 * to an universal components or an object mapping blueprints to components.
 * In the latter case the map must contain a key "default" with a fallback
 * component.
 * 
 * The language is automatically changed following the route-path.
 * 
 * @TODO: How to handle language-specific static routes? Necessary?
 */
export function createRouter(
  routes: IRoutes,
  options: IRouterOptions
): Router {

  const routesNormalized: IRoutesNormalized = normalizeRoutes(routes)

  // create router
  const router = createVueRouter({
    history: getHistoryMode(options.history),
    routes: []
  })
  //router.addRoute(getHomeRoute())
  router.addRoute(getCatchAllRoute())

  // beforeEach handles dynamic route creation and page request
  router.beforeEach(async (to: RouteLocationNormalized) => {
    switch(to.meta.type) {

      // home '/', redirects or loads, holds also the children of nested routes
      case 'home': {
        const home = globalStore.getHomeSlug()
        if (isStr(home, 1)) {
          return home
        }
        return await loadPage(to.path, true, options.notfound)
      }

      // dynamically by catchall added route
      case 'dynamic': {
        if (to.meta.api) {
          return await loadPage(to.path, true, options.notfound)
        }
        return true
      }

      // add the requested route and redirect to it
      case 'catchall': {

        // static
        if (has(routesNormalized, to.path)) {
          addRoutes( router, to.path, routesNormalized[to.path], false)
          return to.fullPath
        }
        
        // blueprint
        else {
          const redirect = await loadPage(to.path, to.fullPath, options.notfound)
          addRoutes(router, to.path, getComponent(routesNormalized, pageStore.get('meta.blueprint')), true)
          return redirect
        }
      }
    }
  })

  return router
}