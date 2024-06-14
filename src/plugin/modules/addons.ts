import { has, isFunc, inArr, isObj, isStr } from '../../fn'
import { stores, storesMap } from './stores'
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
export async function loadAddons(addons: IApiAddon[]): Promise<IApiAddon[]> {
  const registered: IApiAddon[] = []

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
  }

  // init functions
  for (let j = 0; j < registered.length; j++) {
    if (isFunc(registered[j].init)) {
      await registered[j].init!()
    }
  }

  // register and init 
  for (let j = 0; j < registered.length; j++) {
    if (has(registered[j], 'store')) {
      stores(registered[j].name, registered[j].store)
    }
  }
  for (const name in storesMap) {
    await storesMap[name].init()
  }
  return registered
}