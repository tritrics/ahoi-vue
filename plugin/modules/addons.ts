import { has, isFn, inArr, isObj, isStr } from '../../utils'
import { stores } from './stores'
import type { Object, IApiAddon, IBaseStore } from '../../types'

/**
 * Registered plugins as given with createApi(options)
 * Plugins here mean: Plugins of the API-Plugin.
 */
const registeredAddons: string[] = []

/**
 * Vue's inject can't be used outside components, so we build our own
 */
const registeredExports: { [ key: string ]: Object } = {}

/**
 * Inject a method from other addon.
 * If not method is given, the function returnes the existance of the addon as boolean.
 */
export function inject(addon: string, method: string|null = null, fnDefault: Function = () => {}): Function|IBaseStore|boolean {
  if (isStr(method, 1)) {
    if (has(registeredExports, addon, method)) {
      return registeredExports[addon][method]
    } else {
      return fnDefault
    }
  }
  return inArr(addon, registeredAddons)
}

/**
 * Load Addons
 */
export async function loadAddons(addons: IApiAddon[]): Promise<IApiAddon[]> {
  const registered: IApiAddon[] = []
  addons = addons.flat()

  // register addons
  for (let i = 0; i < addons.length; i++) {
    if ( !isObj(addons[i]) || !has(addons[i], 'name')) {
      continue
    }
    const key: string = addons[i].name
    if (!inArr(key, registeredAddons)) {
      registered.push(addons[i])
      registeredAddons.push(key)
      registeredExports[key] = addons[i].export as Object
      if (isObj(addons[i].store)) {
        registeredExports[key].store = addons[i].store
      }
    }
  }

  // check dependencies
  for (let i = 0; i < registered.length; i++) {
    if (isFn(registered[i].dependencies)) {
      registered[i].dependencies!(registeredAddons)
    }
  }

  // register stores 
  for (let i = 0; i < registered.length; i++) {
    if (has(registered[i], 'store')) {
      stores(registered[i].name, registered[i].store)
    }
  }

  // call init() in 1. addons and 2. stores
  return Promise.resolve()
    .then(() => {
      const promises: Promise<void>[] = []
      for (let i = 0; i < registered.length; i++) {
        if (isFn(registered[i].init)) {
          promises.push(registered[i].init!())
        }
      }
      return Promise.all(promises)
    })
    .then(() => {
      const promises: Promise<void>[] = []
      for (let i = 0; i < registered.length; i++) {
        if (has(registered[i], 'store')) {
          promises.push(registered[i].store!.init())
        }
      }
      return Promise.all(promises)
    })
    .then(() => {
      return registered
    })
}