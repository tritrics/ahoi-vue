import { createRouter as createVueRouter } from 'vue-router'
import { isTrue, isStr, toPath } from '../../utils'
import { routerStore } from '../index'
import { siteStore } from '../../site'
import { apiStore, getPage } from '../../plugin'
import type { Router, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

/**
 * Resolve the route record for the given path.
 */
async function getRouteRecord(path: string): Promise<RouteRecordRaw> {
  try {
    if (apiStore.isTrue('multilang')) {
      const url = new URL(path, window.location.href)
      const changed = apiStore.setLangFromUrl(url.href)
      if (changed) {
        await apiStore.updateStores()
      }
    }
    const page = await getPage(apiStore.getNodeFromPath(path), { raw: true })
    return routerStore.getRouteRecord(page.body.meta.blueprint, path, { error: false })
  }
  catch (E) {
    console.error(E)
    return routerStore.getRouteRecord('error', path, { error: true })
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

  // beforeEach: add dynamic route
  router.beforeEach(async (to: RouteLocationNormalized) => {
    if (to.name === 'new') {
      const routeRecord = await getRouteRecord(to.path)
      router.addRoute(routeRecord)
      return to.fullPath
    }
    return true
  })

  // beforeResolve: request page data
  router.beforeResolve(async (to: RouteLocationNormalized) => {
    if (to.name === 'dynamic') {

      // request page, fields are defined in router.blueprints or set to '*' as default
      await siteStore.loadPageByPath(
        to.meta.error ? toPath(apiStore.get('lang'), apiStore.get('error')) : to.path,
        to.meta.fields as string[]|boolean|'*',
        true,
        false
      )

      // handle home slug
      if (to.path === '/') {
        const home = apiStore.getHomeSlug()
        if (isStr(home, 1) && home !== '/') {
          return home
        }
      }
      return true
    }
  })

  // afterEach: track
  router.afterEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {

      // init is false on default and set to true with the first route,
      // so template can be rendered
      const url = new URL(to.path, window.location.href)
      routerStore.set('url', url.href)
      routerStore.set('init', true)

      // track
      track(
        to.fullPath,
        siteStore.get('page')?.meta?.title,
        from?.fullPath
      )
  })
  return router
}