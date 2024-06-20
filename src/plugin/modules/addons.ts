import { has, isFunc, inArr, isObj, isStr } from '../../fn'
import { stores } from './stores'
import type { Object, IApiAddon } from '../../types'

/**
 * Registered plugins as given with createApi(options)
 * Plugins here mean: Plugins of the API-Plugin.
 */
const registeredAddons: string[] = []

/**
 * Vue's inject can't be used outside components, so we build our own
 */
const registeredMethods: { [ key: string ]: Object } = {}

/**
 * Inject a method from other addon.
 * If not method is given, the function returnes the existance of the addon as boolean.
 */
export function inject(addon: string, method: string|null = null, fnDefault: Function = () => {}): Function|boolean {
  if (isStr(method, 1)) {
    if (has(registeredMethods, addon, method)) {
      return registeredMethods[addon][method]
    } else {
      return fnDefault
    }
  }
  return inArr(addon, registeredAddons)
}

/**
 * Load Addons
 */
export async function loadAddons(addonFns: Function[]): Promise<IApiAddon[]> {
  const registered: IApiAddon[] = []

  // call addon functions
  let addons: IApiAddon[] = []
  for (let i = 0; i < addonFns.length; i++) {
    addons.push(addonFns[i]())
  }
  addons = addons.flat()

  // register addons
  for (let i = 0; i < addons.length; i++) {
    if ( !isObj(addons[i]) || !has(addons[i], 'name')) {
      continue
    }
    registered.push(addons[i])
    const key: string = addons[i].name
    if (!inArr(key, registeredAddons)) {
      registeredAddons.push(key)
      if (isObj(addons[i].export)) {
        registeredMethods[key] = addons[i].export as Object
      }
    }
    console.log('registered', key)
  }

  // init functions
  for (let i = 0; i < registered.length; i++) {
    if (isFunc(registered[i].init)) {
      await registered[i].init!()
    }
  }

  // register stores 
  for (let i = 0; i < registered.length; i++) {
    if (has(registered[i], 'store')) {
      stores(registered[i].name, registered[i].store)
    }
  }
  return registered
}