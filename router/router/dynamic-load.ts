import { createRouter as createVueRouter } from 'vue-router'
import { isTrue, isStr } from '../../fn'
import { routerStore, pageStore } from '../index'
import { globalStore } from '../../plugin'
import type { Router, RouteLocationNormalized } from 'vue-router'

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
    console.warn(`Error on loading path ${path}`, err)
    return false
  }
}

/**
 * Factory for router with dynamically added routes and
 * automatically page loades in pageStore.
 */
export function routerFactory(): Router {
    const router = createVueRouter({
    history: routerStore.getHistoryMode(),
    scrollBehavior() {
      return isTrue(routerStore.get('scroll')) ? {
        left: 0,
        top: 0,
        behavior: 'smooth'
      } : false
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
        router.addRoute(routerStore.getRoute(blueprint, to.path, { loaded: true }))
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

        // update router status
        const url = new URL(to.path, window.location.href)
        routerStore.set('url', url.href)
        return true
      }
    }
  })
  return router
}