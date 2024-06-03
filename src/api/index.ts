import { has, each } from '../fn'
import Request from './Request'
import { stores } from '../stores'
import { loadAddons } from '../addons'
import { version } from '../../package.json'
import type { IFormParams, IApiOptions, IApiRequestOptions, ApiMethods, IApiAddon, JSONObject, IStore } from '../types'

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
export async function getLanguage(options: IApiRequestOptions = {} ): Promise<JSONObject> {
  return await createRequest(options).getLanguage()
}

/**
 * Call API interface /page/(:all?).
 * Returns information of a single page or site (if node is empty).
 */
export async function getFields(
  path: string,
  options: IApiRequestOptions = {}
): Promise<JSONObject> {
  return await createRequest(options).getFields(path)
}

/**
 * Call API interface /pages/(:all?).
 * Returns information of sub-pages of a single page or site (if node is empty).
 */
export async function getPages(
  path: string,
  options: IApiRequestOptions = {}
): Promise<JSONObject> {
  return await createRequest(options).getPages(path)
}

/**
 * Call API interface /pages/(:all?).
 * Returns information of sub-pages of a single page or site (if node is empty).
 */
export async function getFiles(
  path: string,
  options: IApiRequestOptions = {}
): Promise<JSONObject> {
  return await createRequest(options).getFiles(path)
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
  const name: string = 'api'
  stores.options.set(options)

  // add Addons, usage: $api.site or inject('api.site')
  let addons: IApiAddon[] = []
  if (has(options, 'addons')) {
    addons = await loadAddons(options.addons!)
  }
      console.log('plugins')
  
  // register plugin
  return {
    install: async (app: any) => {
      app.config.globalProperties[`$${name}`] = {
        APIVERSION,
        VERSION,
        getInfo,
        getLanguage,
        getFields,
        getPages,
        getFiles,
        call,
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