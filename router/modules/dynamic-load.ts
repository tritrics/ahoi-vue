import { createRouter as createVueRouter } from 'vue-router'
import { isTrue, isStr } from '../../utils'
import { routerStore } from '../index'
import { siteStore } from '../../site'
import { apiStore } from '../../plugin'
import type { Router, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

/**
 * Loading a page from a path, select language and return blueprint.
 * Returns false, is page was not found.
 */
async function findPage(path: string): Promise<string|false> {
  try {
    if (apiStore.isTrue('multilang')) {
      const url = new URL(path, window.location.href)
      const changed = apiStore.setLangFromUrl(url.href)
      if (changed) {
        await apiStore.updateStores()
      }
    }

    // Request, but don't commit. Committed by Layout.vue.
    await siteStore.loadPageByPath(path, true, true, false)
    return siteStore.getNextPageBlueprint() ?? 'default'
  }
  catch (err) {
    console.error(err)

    // @TODO: set path to Kirbys notfound-page in config and request that here
    // or do this in PageModel
    return false
  }
}

/**
 * Factory for router with dynamically added routes and
 * automatically page loades in siteStore.
 */
export function routerFactory(track: Function): Router {
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
      name: 'new',
      meta: {
        loaded: false
      },
      children: [],
    }],
  })

  // beforeEach handles dynamic route creation and page request
  router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    switch(to.name) {

      // step 1.
      // unknown route is entered, dynamic route is added and redirected to
      case 'new': {
        const blueprint: string|false = await findPage(to.path)
        const routeRecord: RouteRecordRaw = routerStore.getRouteRecord(blueprint, to.path, { loaded: true })
        router.addRoute(routeRecord)
        return to.fullPath
      }

      // step 2.
      // dynamic route is entered and displays the component(s)
      case 'dynamic': {

        // handle home slug
        if (to.path === '/') {
          const home = apiStore.getHomeSlug()
          if (isStr(home, 1) && home !== '/') {
            track(
              to.fullPath,
              siteStore.getNextPageTitle(),
              from?.fullPath
            )
            return home
          }
        }

        // in normal cases catchall has already loaded page.
        if (siteStore.get('path') !== to.path) {
          await findPage(to.path)
        }

        // update router status
        const url = new URL(to.path, window.location.href)
        routerStore.set('url', url.href)
        track(
          to.fullPath,
          siteStore.getNextPageTitle(),
          from?.fullPath
        )
        return true
      }
    }
  })
  return router
}