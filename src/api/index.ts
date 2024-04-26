import { has, each } from '../fn'
import Request from './Request'
import RequestOptions from './Options'
import { loadPlugins, subscribe } from './plugins'
import { version } from '../../package.json'
import type { FormPostData, ApiOptions, ApiRequestOptions, ApiMethods, ApiPlugin, JSONObject } from '../types'

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
 * Options
 * 
 * Default options are defined on initialisation by createApi() or separately 
 * by defineConfig(). Default Options are used for every request.
 * 
 * Default options can be optionally overwritten for a single request in three ways:
 * 1. getPage(node, {Object} options)
 * 2. createRequest({Object} options)[...]
 * 3. createRequest().limit(5).fields(...)[...]
 */
let Options: RequestOptions = new RequestOptions()

/**
 * Create (default) options for all requests.
 */
export function defineConfig(
  options: ApiRequestOptions,
  reset: boolean = false
): void
{
  Options = Options.clone(options, reset)
}

/**
 * Create a request object for use with chainging-functions.
 */
export function createRequest(options: ApiRequestOptions = {}): Request {
  return new Request(Options.clone(options))
}

/**
 * Call API interface /info.
 * Returns global information about the site.
 */
export async function getInfo(options: ApiRequestOptions = {}): Promise<JSONObject> {
  return await createRequest(options).info()
}

/**
 * Call API interface /language/(:any).
 * Returns information from a single language.
 */
export async function getLanguage(lang: string, options: ApiRequestOptions = {} ): Promise<JSONObject> {
  return await createRequest(options).language(lang)
}

/**
 * Call API interface /page/(:all?).
 * Returns information of a single page or site (if node is empty).
 */
export async function getPage( path: string, options: ApiRequestOptions = {}): Promise<JSONObject> {
  return await createRequest(options).page(path)
}

/**
 * Call API interface /pages/(:all?).
 * Returns information of sub-pages of a single page or site (if node is empty).
 */
export async function getPages(path: string, options: ApiRequestOptions = {}): Promise<JSONObject> {
  return await createRequest(options).pages(path)
}

/**
 * Submit data to a specified action /action/(:any).
 */
export async function createAction(
  action: string,
  data: FormPostData = {},
  options: ApiRequestOptions = {}
): Promise<JSONObject>
{
  return await createRequest(options).create(action, data)
}

/**
 * Generic API-request
 */
export async function apiCall(
  path: string,
  method: ApiMethods = 'GET',
  data: FormPostData = {},
  options: ApiRequestOptions = {}
): Promise<JSONObject>
{
  return await createRequest(options).call(path, method, data)
}

/**
 * Internally used function to set the language in Options.
 */
function setLang(lang: string) {
  Options.setLang(lang)
}

/**
 * Internally used function to "inform" Options that this is a multilang installation.
 */
function setMultilang(multilang: boolean) {
  Options.setMultilang(multilang)
}

/**
 * Creating the Vue-Plugin. 
 */
export async function createApi(options: ApiOptions) {
  const name: string = has(options, 'name') ? options.name! : 'api'
  defineConfig(options)
  subscribe('on-changed-langcode', setLang)
  subscribe('on-changed-multilang', setMultilang)

  // load Plugin-Plugins
  let plugins: ApiPlugin[] = []
  if (has(options, 'plugins')) {
    plugins = await loadPlugins(options.plugins!)
  }
  
  // register plugin
  return {
    install(app: any): void { // any => VueConstructor would be correct, but impossible to import
      app.config.globalProperties[`$${name}`] = {
        APIVERSION,
        VERSION,
        defineConfig,
        createRequest,
        getInfo,
        getPage,
        getPages,
        createAction,
        apiCall,
      }
      app.provide(name,  app.config.globalProperties[`$${name}`])

      // add plugins, usage: $api.site or inject('api.site')
      each(plugins, (def: ApiPlugin) => {
        app.config.globalProperties[`$${name}`][def.name] = def.export
        app.provide(`${name}.${def.name}`, def.export)
        each(def?.components, (component: any, name: string) => {
          app.component(name, component)
        })
      })
    }
  }
}