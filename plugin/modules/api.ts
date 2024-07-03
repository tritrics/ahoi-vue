import { ref } from 'vue'
import { Request } from '../index'
import type { IFormParams, IApiRequestOptions, ApiMethods, JSONObject } from '../../types'

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
 * Create a request object for use with chainging-functions.
 */
function createRequest(options: IApiRequestOptions = {}): Request {
  return new Request(options)
}

/**
 * Call API interface /file/(:all?).
 * Returns information of a single page or site (if node is empty).
 */
export async function getFile(
  path: string|string[],
  options: IApiRequestOptions = {}
): Promise<JSONObject> {
  return await createRequest(options).getNode('file', path)
}

/**
 * Shortcut to get only the fields of a page or site as ref()
 */
export async function getFieldsRef(
  path: string|string[],
  options: IApiRequestOptions = {}
): Promise<JSONObject> {
  const response = await createRequest(options).getNode('page', path)
  return ref(response.fields ?? response.body.fields)
}

/**
 * Call API interface /pages/(:all?).
 * Returns information of sub-pages of a single page or site (if node is empty).
 */
export async function getFiles(
  path: string|string[],
  options: IApiRequestOptions = {}
): Promise<JSONObject> {
  return await createRequest(options).getCollection('files', path)
}

/**
 * Call API interface /info.
 * Returns global information about the site.
 */
export async function getInfo(
  options: IApiRequestOptions = {}
): Promise<JSONObject> {
  return await createRequest(options).getInfo()
}

/**
 * Call API interface /language/(:any).
 * Returns information from a single language.
 */
export async function getLanguage(
  lang: string,
  options: IApiRequestOptions = {}
): Promise<JSONObject> {
  return await createRequest(options).getLanguage(lang)
}

/**
 * Call API interface /page/(:all?).
 * Returns information of a single page or site (if node is empty).
 */
export async function getPage(
  path: string|string[]|null = null,
  options: IApiRequestOptions = {}
): Promise<JSONObject> {
  return await createRequest(options).getNode('page', path)
}

/**
 * Call API interface /pages/(:all?).
 * Returns information of sub-pages of a single page or site (if node is empty).
 */
export async function getPages(
  path: string|string[]|null = null,
  options: IApiRequestOptions = {}
): Promise<JSONObject> {
  return await createRequest(options).getCollection('pages', path)
}

/**
 * Submit data to a specified action /action/(:any).
 */
export async function postCreate(
  action: string|string[],
  data: IFormParams = {},
  options: IApiRequestOptions = {}
): Promise<JSONObject>
{
  return await createRequest(options).postCreate(action, data)
}