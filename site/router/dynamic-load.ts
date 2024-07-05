import { createRouter as createVueRouter, createWebHashHistory, createWebHistory, createMemoryHistory } from 'vue-router'
import { isTrue, isStr, toKey } from '../../fn'
import Routes from '../classes/Routes'
import { globalStore, debug } from '../../plugin'
import { pageStore } from '../index'
import type { Router, RouteLocationNormalized } from 'vue-router'
import type { IRoutes, IRouterOptions } from "../types"

/**
 * Get history mode, hash is default
 */
function getHistoryMode(mode: string|undefined) {
  switch(toKey(mode)) {
    case 'web':
      return createWebHistory()
    case 'memory':
      return createMemoryHistory()
    default:
       return createWebHashHistory()
  }
}

/**
 * Loading a page from a path, select language and return blueprint.
 * Reteurn false, is page was not found.
 */
async function loadPage(path: string): Promise<string|false> {
  try {
    if (globalStore.isTrue('multilang')) {
      const url = new URL(path, window.location.href)
      globalStore.setLangFromUrl(url.href)
      await globalStore.updateStores()
    }
    await pageStore.loadByPath(path)
    return pageStore.get('meta.blueprint') ?? 'default'
  }
  catch (err) {
    debug.warn(`Error on loading path ${path}`, err)
    return false
  }
}

/**
 * Creating the router
 */
export function createRouter(options: IRouterOptions): Router|undefined {
  let routeDef: IRoutes
  try {
    routeDef = new Routes(options)
  } catch(e) {
    debug.error(e)
  }

  // create router
  const router = createVueRouter({
    history: getHistoryMode(options.history),
    scrollBehavior() {
      return isTrue(options.scroll) ? { left: 0, top: 0, behavior: 'smooth' } : false
    },
    routes: [{
      path: '/:catchAll(.*)',
      name: 'catchall',
      meta: {
        loaded: false
      },
      children: [],
    }],
  })

  // beforeEach handles dynamic route creation and page request
  router.beforeEach(async (to: RouteLocationNormalized) => {
    switch(to.name) {

      // step 1.
      // catchall route is entered, dynamic route is added and redirected to
      case 'catchall': {
        const blueprint: string|false = await loadPage(to.path)
        router.addRoute(routeDef.get(blueprint, to.path, { loaded: true }))
        return to.fullPath
      }

      // step 2.
      // dynamic route is entered and displays the component(s)
      case 'dynamic': {

        // handle home slug
        if (to.path === '/') {
          const home = globalStore.getHomeSlug()
          if (isStr(home, 1) && home !== '/') {
            return home
          }
        }

        // in normal cases catchall has already loaded page.
        if (pageStore.get('path') !== to.path) {
          await loadPage(to.path)
        }
        return true
      }
    }
  })
  return router
}