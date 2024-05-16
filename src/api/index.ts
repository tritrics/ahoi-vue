import { has, each } from '../fn'
import Request from './Request'
import { store } from './store'
import { loadAddons } from './addons'
import { version } from '../../package.json'
import type { IFormParams, IApiOptions, IApiRequestOptions, ApiMethods, IApiAddon, JSONObject } from '../types'

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
 * Create a request object for use with chainging-functions.
 */
function createRequest(options: IApiRequestOptions = {}): Request {
  return new Request(options)
}

/**
 * Call API interface /info.
 * Returns global information about the site.
 */
export async function getInfo(options: IApiRequestOptions = {}): Promise<JSONObject> {
  return await createRequest(options).getInfo()
}

/**
 * Call API interface /language/(:any).
 * Returns information from a single language.
 */
export async function getLanguage(lang: string, options: IApiRequestOptions = {} ): Promise<JSONObject> {
  return await createRequest(options).getLanguage(lang)
}

/**
 * Call API interface /page/(:all?).
 * Returns information of a single page or site (if node is empty).
 */
export async function getFields(
  path: string,
  options: IApiRequestOptions = {},
  getFields: boolean = false
): Promise<JSONObject> {
  const res = await createRequest(options).getFields(path)
  return getFields ? res.fields ?? {} : res
}

/**
 * Call API interface /pages/(:all?).
 * Returns information of sub-pages of a single page or site (if node is empty).
 */
export async function getPages(
  path: string,
  options: IApiRequestOptions = {},
  getEntries: boolean = false
): Promise<JSONObject> {
  const res = await createRequest(options).getPages(path)
  return getEntries ? res.entries ?? {} : res
}

/**
 * Call API interface /pages/(:all?).
 * Returns information of sub-pages of a single page or site (if node is empty).
 */
export async function getFiles(
  path: string,
  options: IApiRequestOptions = {},
  getEntries: boolean = false
): Promise<JSONObject> {
  const res = await createRequest(options).getFiles(path)
  return getEntries ? res.entries ?? {} : res
}

/**
 * Submit data to a specified action /action/(:any).
 */
export async function postCreate(
  action: string,
  data: IFormParams = {},
  options: IApiRequestOptions = {}
): Promise<JSONObject>
{
  return await createRequest(options).postCreate(action, data)
}

/**
 * Generic API-request
 */
export async function call(
  path: string,
  method: ApiMethods = 'GET',
  data: IFormParams = {},
  options: IApiRequestOptions = {}
): Promise<JSONObject>
{
  return await createRequest(options).call(path, method, data)
}

/** 
 * Creating the Vue-Plugin. 
 */    
export async function createApi(options: IApiOptions) {
  const name: string = has(options, 'name') ? options.name! : 'api'
  store.setOptions(options)

  // load Addons
  let addons: IApiAddon[] = []
  if (has(options, 'addons')) {
    addons = await loadAddons(options.addons!)
  }
  
  // register plugin
  return {
    install(app: any): void { // any => VueConstructor would be correct, but impossible to import
      app.config.globalProperties[`$${name}`] = {
        APIVERSION,
        VERSION,
        getInfo,
        getLanguage,
        getFields,
        getPages,
        call,
        postCreate,
        store
      }
      app.provide(name,  app.config.globalProperties[`$${name}`])

      // add plugins, usage: $api.site or inject('api.site')
      each(addons, (def: IApiAddon) => {
        app.config.globalProperties[`$${name}`][def.name] = def.export
        app.provide(`${name}.${def.name}`, def.export)
        each(def?.components, (component: any, name: string) => {
          app.component(name, component)
        })
      })
    }
  }
}