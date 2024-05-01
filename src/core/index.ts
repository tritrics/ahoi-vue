import { each, has, isArr, isObj, Options } from '../fn'
import { subscribe } from '../api/plugins'
import Image from './Image'
import BaseModel from './models/Base'
import * as models from './models/models'
import TricNodes from './components/TricNodes.vue'
import TricLink from './components/TricLink.vue'
import TricImage from './components/TricImage.vue'
import type { IImage, IImageOptions } from './types'
import type { ICoreOptions, IApiPlugin, Object, JSONObject } from '../types'

/**
 * workaround to add types to models
 */
const modelsMap: {
  [ key: string ]: typeof BaseModel
} = models

/**
 * Options for models.
 */
export const coreOptions = new Options({
  router: false,
  locale: 'en-US',
  nl2br: false,
  date: { year: 'numeric', month: 'numeric', day: 'numeric' },
  time: { hour: '2-digit', minute: '2-digit' },
})

/**
 * Main function to convert json from response to models.
 */
export function convertResponse(json: JSONObject): Object {
  return has(json, 'body') ? createModel(json.body) : json
}

/**
 * Create a model.
 */
function createModel(node: JSONObject) {
  const type = node.type ?? 'base'
  if (modelsMap[type] !== undefined) {
    return new modelsMap[type](node)
  }
  return new BaseModel(node)
}

/**
 * Recoursively parse node for models.
 */
export function parseModelsRec(nodes: JSONObject): Object|JSONObject {
  if (isObj(nodes)) {
    if (has(nodes, 'type')) {
      return createModel(nodes)
    }
    const res: Object = {}
    each(nodes, (node: JSONObject, key: string) => {
      res[key] = parseModelsRec(node)
    })
    return res as Object
  } else if (isArr(nodes)) {
    const res: Object[] = []
    each(nodes, (node: JSONObject) => {
      res.push(parseModelsRec(node))
    })
    return res
  }
  return nodes
}

/**
 * Change locale in Options.
 */
function setLocale(locale: string): void {
  coreOptions.set('locale', locale)
}

/**
 * Create a Thumb instance with handy image resizing and handling methods.
 */
export function createImage(
  image: JSONObject|IImage,
  width: number|null = null,
  height: number|null = null,
  options: IImageOptions = {}
): Image
{
  // core object given
  if (has(image, '$meta')) {
    return new Image(image.$meta, width, height, options)
  }
  
  // raw file object given
  else if (has(image, 'meta')) {
    return new Image(image.meta, width, height, options)
  }

  // image-node given
  return new Image(image as IImage, width, height, options)
}

/**
 * Plugin
 */
export function createCore(options: ICoreOptions = {}): IApiPlugin {
  coreOptions.set(options)
  return {
    name: 'core',
    components: {
      'TricHtml': TricNodes,
      'TricLink': TricLink,
      'TricImage': TricImage,
    },
    init: () => {
      subscribe('on-changed-locale', setLocale)
    },
    export: {
      convertResponse,
      createImage,
    }
  }
}