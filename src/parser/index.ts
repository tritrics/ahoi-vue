import { each, has, isArr, isObj, camelCase } from '../fn'
import { subscribe } from '../api/plugins'
import ParserOptions from './Options'
import * as models from './models'
import TricNodes from './components/TricNodes.vue'
import TricLink from './components/TricLink.vue'
import type { ApiPlugin, Object, JSONObject, ParserModel } from '../types'

/**
 * Instance of Options
 */
const Options = new ParserOptions()

/**
 * Get as subnode of Options determined by dot-separated path.
 * Example: `link.router`
 */
export function getOption(field: string, prop: string, options: Object = {}): any {
  return Options.get(field, prop, options)
}

/**
 * Set a subnode of Options
 */
export function setOption(path: string, options: Object = {}): void {
  const [ field, prop ] = path.split('.')
  Options.set(field, prop, options)
}

/**
 * Setting or resetting all options at once.
 * Intern defaults are used if a node is not given.
 */
export function initOptions(options: Object = {}) {
  Options.init(options)
}

/**
 * Main function to parse json from response.
 */
export function parseResponse(json: JSONObject): Object {
  if (has(json, 'body')) {
    const res: Object = { type: json.body.type }
    each(
      ['meta', 'translations', 'interface', 'languages', 'collection', 'fields', 'pages', 'files'],
      (node: string) => addToResponse(res, json.body, node)
    )
    return res
  } else if (isField(json)) {
    return createModel(json)
  }
  return {}
}

/**
 * Add a given node to response object.
 */
function addToResponse(res: Object, body: JSONObject, node: string): void {
  if (node === 'translations' && has(body, 'translations')) { // special case
    res.translations = {}
    each(body.translations, (href: string, lang: string) => {
      res.translations[lang] = models.createLinkByValues('page', lang, href)
    })
  } else if (has(body, node)) {
    res[node] = parseFields(body[node]);
  }
}

/**
 * Recoursive function to parse the response from Kirby
 */
function parseFields(nodes: JSONObject): Object {

  // node is Object
  if (isObj(nodes)) {

    // node with type and value
    if (isField(nodes)) {
      return createModel(nodes)
    }
    
    // node with value
    else if (has(nodes, 'value')) {
      return parseFields(nodes.value)
    }
    const res: Object = {}
    each(nodes, (node: JSONObject, key: string) => {
      res[key] = parseFields(node)
    })
    return res as ParserModel
  }

  // node is Array
  else if (isArr(nodes)) {
    const res: Object[] = []
    each(nodes, (node: JSONObject) => {
      res.push(parseFields(node))
    })
    return res
  }
  return nodes
}

/**
 * Model factory
 * Sub-method of parseFields() creating the model for a given field.
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
      return models.createDatetime(node)
    case 'email':
      return models.createLink(node)
    case 'file':
      return models.createFile(createChildModels(node))
    case 'html':
      return models.createHtml(node)
    case 'image':
      return models.createImage(createChildModels(node))
    case 'language':
      return models.createLanguage(node)
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
      if (isArr(node.value) || isObj(node.value)) {
        return parseFields(node.value)
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
    node.value = parseFields(node.value)
  } else if (has(node, 'fields')) {
    node.fields = parseFields(node.fields)
  }
  return node
}

/**
 * Check, if a node is field.
 * This is the case when it has subnodes `type` and `value` or is of type `page`.
 */
function isField(node: JSONObject): boolean {
  return has(node, 'type') && has(node, 'value')
}

/**
 * Change locale in Options.
 */
function setLocale(locale: string): void {
  Options.set('global', 'locale', locale)
}

/**
 * Plugin
 */
export function createParser(options: Object = {}): ApiPlugin {
  initOptions(options)
  return {
    id: 'tric-vue-parser-plugin',
    name: 'parser',
    components: {
      'TricHtml': TricNodes,
      'TricLink': TricLink
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