import { has, each, isStr } from '../fn'
import { call, getFile, getFiles, getInfo, getLanguage, getPage, getPages, getSite, postCreate } from './api'
import Store from './Store'
import { loadAddons } from '../addons'
import { version } from '../../package.json'
import type { Object, IApiOptions, IApiAddon, IStore } from '../types'

/**
 * The API interface version.
 * Same as defined in Kirby-Plugin and required for all requests.
 */
export const APIVERSION: string = 'v1'

/**
 * The Plugin version.
 */
export const VERSION: string = version

/**
 * Map holding all stores.
 */
export const stores: Object = {}

/**
 * Get og implicitely create a store.
 */
export function store(name: string, values?: Object): IStore {
  if (isStr(name, 1) && !has(stores, name)) {
    stores[name] = new Store()
    stores[name].set(values)
  }
  return stores[name] 
}

/**
 * Register a store instance.
 */
export function registerStore(name: string, store: IStore): void {
  if (isStr(name, 1) && !has(stores, name)) {
    stores[name] = store
  }
}

/** 
 * Creating the Vue-Plugin. 
 */
export async function createApi(options: IApiOptions) {
  const name: string = 'api'
  stores.global.set(options)

  // add Addons, usage: $api.site or inject('api.site')
  let addons: IApiAddon[] = []
  if (has(options, 'addons')) {
    addons = await loadAddons(options.addons!)
  }
  
  // register plugin
  return {
    install: async (app: any) => {
      app.config.globalProperties[`$${name}`] = {
        APIVERSION,
        VERSION,
        call,
        getFile,
        getFiles,
        getInfo,
        getLanguage,
        getPage,
        getPages,
        getSite,
        postCreate
      }
      app.provide(name,  app.config.globalProperties[`$${name}`])
      app.provide(`${name}.app`, app)
      each(addons, (addon: IApiAddon) => {
        app.config.globalProperties[`$${name}`][addon.name] = addon.export
        app.provide(`${name}.${addon.name}`, addon.export)
        each(addon?.components, (component: any, name: string) => {
          app.component(name, component)
        })
      })
    }
  }
}