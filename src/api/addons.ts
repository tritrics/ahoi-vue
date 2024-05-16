import { isFunc, has, inArr, isObj } from '../fn'
import type { Object, IApiAddon } from '../types'

/**
 * Registered plugins as given with createApi(options)
 * Plugins here mean: Plugins of the API-Plugin.
 */
const registeredPlugins: string[] = []

/**
 * Vue's inject can't be used outside components, so we build our own
 */
const registeredMethods: { [ key: string ]: Object } = {}

/**
 * Add a plugin.
 */
function register(name: string, methods: Object): void {
  if (!hasAddon(name)) {
    registeredPlugins.push(name)
    registeredMethods[name] = methods
  }
}

/**
 * Check if a plugin given by it's name is exists.
 */
export function hasAddon(name: string): boolean {
  return inArr(name, registeredPlugins)
}

/**
 * inject a method from other plugins
 */
export function inject(plugin: string, method: string, fnDefault: Function = () => {}): Function {
  if (has(registeredMethods, plugin, method)) {
    return registeredMethods[plugin][method]
  } else {
    return fnDefault
  }
}

/**
 * Load Plugins
 */
export async function loadAddons(plugins: IApiAddon[]): Promise<IApiAddon[]> {
  const registered: IApiAddon[] = [{
      name: 'plugins',
      export: {
        hasAddon,
      }
    }
  ]

  // register addons
  for (let i = 0; i < plugins.length; i++) {
    if (
      !isObj(plugins[i]) ||
      !has(plugins[i], 'name') ||
      !has(plugins[i], 'export')
    ) {
      continue
    }
    registered.push(plugins[i])
    register(plugins[i].name, plugins[i].export)
  }

  // setup functions
  for (let j = 0; j < registered.length; j++) {
    if (isFunc(registered[j].setup)) {
      await registered[j].setup?.()
    }
  }

  // init functions
  for (let j = 0; j < registered.length; j++) {
    if (isFunc(registered[j].init)) {
      await registered[j].init?.()
    }
  }

  return registered
}