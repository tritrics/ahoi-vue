import RouterStore from './classes/RouterStore'
import type { IRouterStore } from './types'
import type { Object, IApiAddon } from "../types"
import type { Router } from 'vue-router'

/**
 * Module's store
 */
const store: IRouterStore = new RouterStore()

/**
 * Router types, must exist in ./modules
 */
const installedRouterTypes: string[] = [ 'dynamic-load' ]

/**
 * Router factory
 */
async function getRouter(): Promise<Router|undefined> {
  return import(`./modules/${store.get('type')}`).then(
    (mod: Object) => {
      return mod.routerFactory()
    },
    () => {
      throw new Error(`Router factory ${store.get('type')} not found`)
    })
}

 /**
 * Addon factory
 */
export function createRouter(): IApiAddon {
  return {
    name: 'router',
    store,
    export: {
      store,
      getRouter
    }
  }
}

/**
 * Export module
 */
export { store, installedRouterTypes, getRouter }