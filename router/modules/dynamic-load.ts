import { createRouter as createVueRouter } from 'vue-router'
import { isTrue, isStr } from '../../utils'
import { routerStore } from '../index'
import { siteStore } from '../../site'
import { apiStore, getPage } from '../../plugin'
import type { Router, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

/**
 * Loading a page from a path, select language and add route to router.
 * Returns false, is page was not found.
 */
async function preflight(router: Router, path: string): Promise<void> {
  try {
    if (apiStore.isTrue('multilang')) {
      const url = new URL(path, window.location.href)
      const changed = apiStore.setLangFromUrl(url.href)
      if (changed) {
        await apiStore.updateStores()
      }
    }

    // Request meta data of page to get blueprint
    const preflight = await getPage(apiStore.getNodeFromPath(path), { raw: true })
    const blueprint = preflight?.body?.meta?.blueprint ?? 'default'
    const routeRecord: RouteRecordRaw = routerStore.getRouteRecord(blueprint, path, { loaded: true })
    router.addRoute(routeRecord)
  }
  catch (err) {
    console.error(err)

    // @TODO: set path to Kirbys notfound-page in config and request that here
    // or do this in PageModel
    return
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

        // @todo: in preflight()
        await preflight(router, to.path)
        return to.fullPath
      }

      // step 2.
      // dynamic route is entered and displays the component(s)
      case 'dynamic': {

        // handle home slug
        if (to.path === '/') {
          const home = apiStore.getHomeSlug()
          if (isStr(home, 1) && home !== '/') {
            return home
          }
        }

        // request page, fields are defined in router.blueprints or set to '*' as default
        const fields = to.meta.fields as string[]|boolean|'*'
        await siteStore.loadPageByPath(to.path, fields, true)

        // update router status
        const url = new URL(to.path, window.location.href)
        routerStore.set('url', url.href)

        // track analytics
        track(
          to.fullPath,
          siteStore.get('page')?.meta?.title,
          from?.fullPath
        )
        return true
      }
    }
  })
  return router
}