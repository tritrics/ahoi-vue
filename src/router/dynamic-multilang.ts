import { createRouter as createVueRouter } from 'vue-router'
import { each, count, isObj, isStr, trim } from '../fn'
import { globalStore } from '../plugin'
import { pageStore } from '../site'
import { getHistoryMode, getComponent } from './modules/helper'
import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import type { IRouterRoutes, IRouterComponentsMap, IRouterOptions } from "../types"

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
  components: string|IRouterComponentsMap,
  staticRoutes: IRouterRoutes,
  options: IRouterOptions
): Router {

  // create basic router
  const router = createVueRouter({
    history: getHistoryMode(options.history),
    routes: []
  })

  // add static routes
  if (isObj(staticRoutes) && count(staticRoutes) > 0) {
    each(staticRoutes, (template: string, path: string) => {
      router.addRoute({
        path,
        name: trim(path, '/').replace('/', '-'),
        component: () => import(template),
      })
    })
  }

  // add dynamic api route
  router.addRoute({
    path: '/:catchAll(.*)',
    name: 'api',
    component: () => {
      const meta = pageStore.get('meta')
      return getComponent(components, meta.blueprint ?? 'default')
    }
  })

  // Navigation guards (don't use beforeResolve())
  router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {

    // redirect to home
    if (to.name === 'api') {
      if (to.path === '/' || to.path === '') {
        const home = globalStore.getHomeSlug()
        if (isStr(home, 1)) {
          return next(home)
        }
      }
    }

    // set lang and request page
    try {
      await globalStore.setLangFromUrl()
      if (to.name === 'api') {
        const node = globalStore.getNodeFromPath(to.path)
        await pageStore.load(node)
      }
      return next()
    } catch (error) {
      return next(options.error)
    }
  })
  return router
}