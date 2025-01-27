import { inArr } from '../utils'
import RouterStore from './classes/RouterStore'
import { inject } from '../plugin'
import type { IRouterStore } from './types'
import type { Object, IApiAddon } from "../types"
import type { Router } from 'vue-router'

/**
 * Addon store
 */
const routerStore: IRouterStore = new RouterStore()

/**
 * Router types, must exist in ./modules
 */
const installedRouter: string[] = [ 'dynamic-load' ]

/**
 * The Router
 */
let routerInstance: Router

/**
 * Addon factory
 */
function createRouter(): IApiAddon[] {
  return [{
    name: 'router',
    store: routerStore,
    export: {
      getRouter,
      initRouter,
    },
    dependencies(addons: string[]): void {
      if(!inArr('template', addons)) {
        throw new Error('[AHOI] Addon router requires addon site.')
      }
    }
  }]
}

/**
 * Getter for Router instance
 */
function getRouter(): Router {
  return routerInstance
}

/**
 * Init and get the Router instance
 * @TODO: add a router without autom. load of page
 */
async function initRouter(): Promise<Router> {
  return import(`./modules/${routerStore.get('type')}.ts`).then(
    (mod: Object) => {
      const track = inject('tracker', 'track')
      routerInstance = mod.routerFactory(track)
      return routerInstance
    },
    () => {
      throw new Error(`[AHOI] Router factory ${routerStore.get('type')} not found`)
    })
}

/**
 * Export module
 */
export {
  createRouter,
  getRouter,
  initRouter,
  installedRouter,
  routerStore,
}