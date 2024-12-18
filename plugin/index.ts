import { each } from '../utils'
import ImmutableStore from './classes/ImmutableStore'
import BaseStore from './classes/BaseStore'
import ApiStore from './classes/ApiStore'
import Request from './classes/Request'
import { loadAddons, inject } from './modules/addons'
import { getFile, getFiles, getInfo, getLanguage, getPage, getPages, postCreate } from './modules/api'
import { stores } from './modules/stores'
import { version as VERSION } from '../../package.json'
import type { IApiOptions, IApiAddon, IApiStore, Object } from '../types'

/**
 * The API interface version.
 * Same as defined in Kirby-Plugin and required for all requests.
 */
const APIVERSION: string = 'v1'

/**
 * The global store. Initialized before all other stores.
 */
let apiStore: IApiStore

/** 
 * Plugin factory
 */
async function createApi(setupOptions: IApiOptions, ...addons: IApiAddon[]): Promise<Object> {

  // init the stores
  apiStore = new ApiStore(setupOptions)
  stores('api', apiStore)

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
      app.config.globalProperties['$api'] = {
        APIVERSION,
        VERSION,
        store: apiStore,
        getFile,
        getFiles,
        getInfo,
        getLanguage,
        getPage,
        getPages,
        postCreate,
        stores,
      }
      app.provide('api',  app.config.globalProperties['$api'])
      each(addonsLoaded, (addon: IApiAddon) => {
        app.config.globalProperties['$api'][addon.name] = addon.export
        app.provide(`api.${addon.name}`, addon.export)
        each(addon?.components, (component: any, name: string) => {
          app.component(name, component)
        })
      })

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
  apiStore,
  createApi,
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