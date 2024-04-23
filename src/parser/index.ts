import { each, has, isArr, isObj } from '../fn'
import { subscribe } from '../api/plugins'
import ParserOptions from './Options'
import * as models from './models'
import TheNodes from './components/TheNodes.vue'
import TheLink from './components/TheLink.vue'
import type { ApiPlugin, Object, JSONObject, ParserModel } from '../types'

/**
 * Instance of Options
 */
const Options = new ParserOptions()

/**
 * Get as subnode of Options determined by dot-separated path.
 * Example: `link.router`
 */
export function getOption(field: string, prop: string, params: Object = {}): any {
  return Options.get(field, prop, params)
}

/**
 * Set a subnode of Options
 */
export function setOption(path: string, params: Object = {}): void {
  const [ field, prop ] = path.split('.')
  Options.set(field, prop, params)
}

/**
 * Setting or resetting all options at once.
 * Intern defaults are used if a node is not given.
 */
export function initOptions(params: Object = {}) {
  Options.init(params)
}

/**
 * Recoursive function to parse the response from Kirby
 */
function parseNodes(nodes: JSONObject): Object {

  // node is Object
  if (isObj(nodes)) {

    // node with type and value
    if (isField(nodes)) {
      return createModel(nodes)
    }
    
    // node with value
    else if (has(nodes, 'value')) {
      return parseNodes(nodes.value)
    }
    const res: Object = {}
    each(nodes, (node: JSONObject, key: string) => {
      res[key] = parseNodes(node)
    })
    return res as ParserModel
  }

  // node is Array
  else if (isArr(nodes)) {
    const res: Object[] = []
    each(nodes, (node: JSONObject, key: number) => {
      res[key] = parseNodes(node)
    })
    return res
  }
  return nodes
}

/**
 * Model factory
 * Sub-method of parseNodes() creating the model for a given field.
 */
function createModel(node: JSONObject): Object|ParserModel|ParserModel[] {
  switch(node.type) {
    case 'block':
      return models.createBlock(createChildModels(node))
    case 'boolean':
      return models.createBoolean(node)
    case 'color':
      return models.createColor(node)
    case 'date':
      return models.createDate(node)
    case 'datetime':
      return models.createDateTime(node)
    case 'email':
      return models.createLink(node)
    case 'file':
      return models.createFile(createChildModels(node))
    case 'html':
      return models.createHtml(node)
    case 'image':
      return models.createImage(createChildModels(node))
    case 'info':
      return models.createInfo(createChildModels(node))
    case 'language':
      return models.createLanguage(node)
    case 'languages':
      return models.createLanguages(createChildModels(node))
    case 'link':
      return models.createLink(node)
    case 'markdown':
      return models.createMarkdown(node)
    case 'page':
      return models.createPage(createChildModels(node))
    case 'number':
      return models.createNumber(node)
    case 'option':
      return models.createOption(node)
    case 'site':
      return models.createSite(createChildModels(node))
    case 'tel':
      return models.createLink(node)
    case 'text':
      return models.createText(node)
    case 'time':
      return models.createTime(node)
    case 'url':
      return models.createLink(node)
    case 'user':
      return models.createUser(createChildModels(node))
    default:
      
      // also files, object, pages, structure, users, options
      if (isArr(node.value) || isObj(node.value)) {
        return parseNodes(node.value)
      } else {
        return models.createString(node) 
      }
  }
}

/**
 * Create models, when a field has multiple child fields in node `value`.
 */
function createChildModels(node: JSONObject): Object {
  if (has(node, 'value')) {
    node.value = parseNodes(node.value)
  }
  return node
}

/**
 * Check, if a node is field.
 * This is the case when it has subnodes `type` and `value` or is of type `page`.
 */
function isField(node: JSONObject): boolean {
  return has(node, 'type') && (has(node, 'value') || node.type === 'page')
}

/**
 * Change locale in Options.
 */
function setLocale(locale: string): void {
  Options.set('global', 'locale', locale)
}

/**
 * Main function to parse json from response.
 */
export function parseResponse(json: JSONObject): Object {
  if (has(json, 'body')) {
    return parseNodes(json.body)
  } else if (isField(json)) {
    return createModel(json)
  }
  return {}
}

/**
 * Plugin
 */
export function createParser(params: Object = {}): ApiPlugin {
  initOptions(params)
  return {
    id: 'aflevere-api-vue-parser-plugin',
    name: 'parser',
    components: {
      'TheHtml': TheNodes,
      'TheLink': TheLink
    },
    init: () => {
      subscribe('on-changed-locale', setLocale)
    },
    export: {
      getOption,
      setOption,
      initOptions,
      parseResponse,
    }
  }
}