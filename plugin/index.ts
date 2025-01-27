import { each } from '../utils'
import ImmutableStore from './classes/ImmutableStore'
import BaseStore from './classes/BaseStore'
import MainStore from './classes/MainStore'
import Request from './classes/Request'
import { loadAddons, inject } from './modules/addons'
import { getFile, getFiles, getInfo, getLanguage, getPage, getPages, postCreate } from './modules/api'
import { stores } from './modules/stores'
import { version as VERSION } from '../../package.json'
import type { IApiOptions, IApiAddon, IMainStore, Object } from '../types'

/**
 * The API interface version.
 * Same as defined in Kirby-Plugin and required for all requests.
 */
const APIVERSION: string = 'v1'

/**
 * The global store. Initialized before all other stores.
 */
let mainStore: IMainStore

/** 
 * Plugin factory
 */
async function createAhoi(setupOptions: IApiOptions, ...addons: IApiAddon[]): Promise<Object> {

  // init the stores
  mainStore = new MainStore(setupOptions)
  stores('main', mainStore)

  // load addons
  const addonsLoaded: IApiAddon[] = await loadAddons(addons)

  // init the router
  let Router: any
  if (inject('router')) {
    const initRouter = inject('router', 'initRouter') as Function
    Router = await initRouter()
  }
  
  // register plugin
  return {
    install: async (app: any) => {
      let exports = {}
       each(addonsLoaded, (addon: IApiAddon) => {
        exports = { ...exports, ...addon.export}
        each(addon?.components, (component: any, name: string) => {
          app.component(name, component)
        })
      })

      // in case of name conflicts: plugin exports overwrite addon exports
      app.config.globalProperties['$ahoi'] = {
        ...exports,
        APIVERSION,
        VERSION,
        getFile,
        getFiles,
        getInfo,
        getLanguage,
        getPage,
        getPages,
        postCreate,
        stores,
      }
      app.provide('ahoi',  app.config.globalProperties['$ahoi'])

      // add router (last step!)
      if (Router) {
        app.use(Router)
      }
    },
    getRouter: () => Router ?? undefined
  }
}

/**
 * Export module
 */
export {
  APIVERSION,
  VERSION,
  mainStore,
  createAhoi,
  getFile,
  getFiles,
  getInfo,
  getLanguage,
  getPage,
  getPages,
  inject,
  postCreate,
  stores,
  ImmutableStore,
  BaseStore,
  Request,
}