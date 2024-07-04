import { createRouter as createVueRouter, createWebHashHistory, createWebHistory, createMemoryHistory } from 'vue-router'
import { each, has, count, upperFirst, uuid, trim, isArr, isStr, isTrue, toKey, toStr } from '../../fn'
import { globalStore } from '../../plugin'
import { pageStore } from '../index'
import type { Router, RouteLocationNormalized } from 'vue-router'
import type { IRoutes, IRoutesNormalized, IRouterOptions, IRouteComponents } from "../types"

/**
 * Routine to add the dynamic routes. Routes are added as child to home.
 * If path has more slugs, a child route is added for each slug to enable the
 * routes link classes (router-link-active).
 */
function addRoutes(router: Router, path: string, components: IRouteComponents, api: boolean): void {
  const component = components.pop() as string

  // adding root with template
  router.addRoute({
    path,
    name: 'dynamic',
    meta: { type: 'catchall', api, },
    component: count(components) === 1 ? () => import(components[0]) : undefined,
    children: [],
  })

  // adding child routes
  const slugs: string[] = trim(path, '/').split('/')
  let parent: string = 'dynamic'
  for (let i = 0; i < slugs.length; i++) {

    // Only last child is "dynamic", the parents are "catchall" –
    // otherwise the component wont't be reloaded when navigating from /foo/bar to /foo.
    const isLast: boolean = (i + 1 === slugs.length)
    const name: string = `dynamic-${uuid()}`
    router.addRoute(parent, {
      path,
      name,
      meta: { type: isLast ? 'dynamic' : 'catchall', api, },
      component: () => import(component),
      children: [],
    })
    parent = name
  }
}

/**
 * Get history mode.
 */
export function getHistoryMode(mode: string|undefined) {
  switch(toKey(mode)) {
    case 'hash':
      return createWebHashHistory()
    case 'memory':
      return createMemoryHistory()
    default:
       return createWebHistory() // import.meta.env.BASE_URL
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
    if (!isStr(key, 1)) {
      return
    }
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
    routes: [],
    scrollBehavior() {
      return isTrue(options.scroll) ? { left: 0, top: 0, behavior: 'smooth' } : false
    },
  })

  // catchall route
  router.addRoute({
    path: '/:catchAll(.*)',
    name: 'cachall',
    meta: { type: 'catchall' },
    component: null,
    children: []
  })

  // beforeEach handles dynamic route creation and page request
  router.beforeEach(async (to: RouteLocationNormalized) => {
    switch(to.meta.type) {

      // dynamically by catchall added route
      case 'dynamic': {
        if (to.path === '/') {
          const home = globalStore.getHomeSlug()
          if (isStr(home, 1) && home !== '/') {
            return home
          }
        }

        // in normal cases the catchall route has already loaded the page
        if (to.meta.api) {
          if (pageStore.get('meta.href') !== to.path) {
            return await loadPage(to.path, true, options.notfound)
          }
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