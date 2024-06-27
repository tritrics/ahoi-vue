import { createRouter as createVueRouter } from 'vue-router'
import { each, count, has, isObj, isStr } from '../fn'
import { globalStore } from '../plugin'
import { pageStore } from '../site'
import { getHistoryMode, getComponent } from './modules/helper'
import type { Router, RouteLocationNormalized } from 'vue-router'
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

  const hasTemplate: boolean = has(options, 'template') && isStr(options.template, 1)

  // create basic router
  const router = createVueRouter({
    history: getHistoryMode(options.history),
    routes: []
  })

  // add home route
  router.addRoute({
    path: '/',
    name: 'home',
    meta: { type: 'home' },
    component: () => import(options.template as string),
    children: []
  })

  // add optional static routes
  if (isObj(staticRoutes) && count(staticRoutes) > 0) {
    each(staticRoutes, (template: string, path: string) => {
      router.addRoute({
        path,
        meta: { type: 'static' },
        component: () => import(template),
      })
    })
  }

  // add catch all route
  router.addRoute({
    path: '/:catchAll(.*)',
    meta: { type: 'catchall' },
    component: () => import(getComponent(components, 'default'))
  })

  // Navigation guards (don't use beforeResolve())
  // router.beforeResolve((to, from) => {})
  // router.afterEach((to, from) => {})
  router.beforeEach(async (to: RouteLocationNormalized) => {

    // redirect to home
    if (to.meta.type === 'root') {
      const home = globalStore.getHomeSlug()
      if (isStr(home, 1)) {
        return home
      }
    }

    // set lang and request page
    try {
      await globalStore.setLangFromUrl()

      // dynamic route allready added
      if (to.meta.type === 'dynamic') {
        await pageStore.load(to.path, true)
        return
      }
      // dynamic route missing -> add route and redirect
      else if (to.meta.type === 'catchall') {
        await pageStore.load(to.path, true)
        const route = {
          path: to.path,
          meta: { type: 'dynamic' },
          component: () => import(getComponent(components, pageStore.get('blueprint')))
        }
        if (hasTemplate) {
          router.addRoute('home', route)
        } else {
          router.addRoute(route)
        }
        return to.fullPath
      }
    }
    
    // error in setting language or requesting page
    catch (error) {
      ahoi.error('error while resolving route', error)
      return options.notfound
    }
  })
  return router
}