import RouterStore from './classes/RouterStore'
import PageStore from './classes/PageStore'
import type { IRouterStore, IPageStore } from './types'
import type { Object, IApiAddon } from "../types"
import type { Router } from 'vue-router'

/**
 * Module's store
 */
const routerStore: IRouterStore = new RouterStore()

/**
 * Page store
 */
const pageStore: IPageStore = new PageStore()

/**
 * Router types, must exist in ./modules
 */
const installedRouterTypes: string[] = [ 'dynamic-load' ]

/**
 * Router factory
 * @TODO: add a router without autom. load of page, don't export pageStore
 */
async function getRouter(): Promise<Router|undefined> {
  return import(`./modules/${routerStore.get('type')}`).then(
    (mod: Object) => {
      return mod.routerFactory()
    },
    () => {
      throw new Error(`Router factory ${routerStore.get('type')} not found`)
    })
}

 /**
 * Addon factory
 */
export function createRouter(): IApiAddon[] {
  return [{
    name: 'router',
    store: routerStore,
    export: {
      store: routerStore,
      getRouter
    }
  }, {
    name: 'page',
    store: pageStore,
    export: {
      store: pageStore,
    }
  }]
}

/**
 * Export module
 */
export { routerStore, pageStore, installedRouterTypes, getRouter }