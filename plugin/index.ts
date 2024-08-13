import { each, isTrue } from '../fn'
import AddonStore from './classes/AddonStore'
import BaseStore from './classes/BaseStore'
import UserStore from './classes/UserStore'
import GlobalStore from './classes/GlobalStore'
import Request from './classes/Request'
import { loadAddons, inject } from './modules/addons'
import debug from './modules/debug'
import { call, getFieldsRef, getFile, getFiles, getInfo, getLanguage, getPage, getPages, postCreate } from './modules/api'
import { stores } from './modules/stores'
import { version as VERSION } from '../../package.json'
import type { IApiOptions, IApiAddon, IGlobalStore, IAddonStore } from '../types'

/**
 * The API interface version.
 * Same as defined in Kirby-Plugin and required for all requests.
 */
const APIVERSION: string = 'v1'

/**
 * The user options store. Initialized before all other stores.
 */
let optionsStore: IAddonStore

/**
 * The global store. Initialized before all other stores.
 */
let globalStore: IGlobalStore

/** 
 * Plugin factory
 */
export async function createApi(options: IApiOptions, ...addons: IApiAddon[]) {
  debug.activate(isTrue(options.debug, false))
  debug.log(':: AHOI PLUGIN INSTALLED ::')

  // init the stores
  optionsStore = new AddonStore(options)
  stores('options', optionsStore)
  globalStore = new GlobalStore()
  stores('global', globalStore)

  // load addons
  const addonsLoaded: IApiAddon[] = await loadAddons(addons)

  // init the router
  let Router: any
  if (inject('router')) {
    const getRouter = inject('router', 'getRouter') as Function
    Router = await getRouter()
  }
  
  // register plugin
  return {
    install: async (app: any) => {
      app.config.globalProperties['$api'] = {
        APIVERSION,
        VERSION,
        store: globalStore,
        options: optionsStore,
        call,
        getFieldsRef,
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
    }
  }
}

/**
 * Export module
 */
export {
  APIVERSION,
  debug,
  VERSION,
  globalStore,
  optionsStore,
  call,
  getFieldsRef,
  getFile,
  getFiles,
  getInfo,
  getLanguage,
  getPage,
  getPages,
  inject,
  postCreate,
  stores,
  AddonStore,
  BaseStore,
  UserStore,
  Request,
}