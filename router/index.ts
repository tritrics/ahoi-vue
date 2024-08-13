import { inArr } from '../fn'
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
async function getRouter(): Promise<Router> {
  return import(`./router/${routerStore.get('type')}.ts`).then(
    (mod: Object) => {
      return mod.routerFactory()
    },
    () => {
      throw new Error(`AHOI Plugin: Router factory ${routerStore.get('type')} not found`)
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
    },
    dependencies(addons: string[]): void {
      if(!inArr('site', addons)) {
        throw new Error('AHOI Plugin: Addon router requires addon site.')
      }
    }
  }, {
    name: 'page',
    store: pageStore,
    export: {
      store: pageStore,
    },
    dependencies(addons: string[]): void {
      if(!inArr('site', addons)) {
        throw new Error('AHOI Plugin: Addon page of router requires addon site.')
      }
    }
  }]
}

/**
 * Export module
 */
export { routerStore, pageStore, installedRouterTypes, getRouter }