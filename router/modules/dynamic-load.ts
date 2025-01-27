import { createRouter as createVueRouter } from 'vue-router'
import { isTrue, isStr, toPath } from '../../utils'
import { routerStore } from '../index'
import { templateStore } from '../../template'
import { mainStore, getPage } from '../../plugin'
import type { Router, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

/**
 * Resolve the route record for the given path.
 */
async function getRouteRecord(path: string): Promise<RouteRecordRaw> {
  try {
    if (mainStore.isTrue('multilang')) {
      const url = new URL(path, window.location.href)
      const changed = mainStore.setLangFromUrl(url.href)
      if (changed) {
        await mainStore.updateStores()
      }
    }
    const page = await getPage(mainStore.getNodeFromPath(path), { raw: true })
    return routerStore.getRouteRecord(page.body.meta.blueprint, path, { error: false })
  }
  catch (E) {
    console.error(E)
    return routerStore.getRouteRecord('error', path, { error: true })
  }
}

/**
 * Factory for router with dynamically added routes and
 * automatically page loades in templateStore.
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
      routerStore.beforeEach()
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
      await templateStore.loadPageByPath(
        to.meta.error ? toPath(mainStore.get('lang'), mainStore.get('error')) : to.path,
        to.meta.fields as string[]|boolean|'*',
        true,
        false
      )

      // handle home slug
      if (to.path === '/') {
        const home = mainStore.getHomeSlug()
        if (isStr(home, 1) && home !== '/') {
          await routerStore.beforeResolve()
          return home
        }
      }
      await routerStore.beforeResolve()
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
      templateStore.get('page')?.meta?.title,
      from?.fullPath
    )
  })
  return router
}