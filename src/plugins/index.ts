import { isStr, isFunc, has, inArr, isObj } from '../fn'
import { createImages } from '../images'
import type { Object, ApiPlugin } from '../types'

/**
 * Registered plugins as given with createApi(params)
 * Plugins here mean: Plugins of the API-Plugin.
 */
const registeredPlugins: string[] = []

/**
 * Simple and basic event bus for communication between Plugins.
 */
const registeredEvents: { [ key: string ]: any[] } = {}

/**
 * Vue's inject can't be used outside components, so we build our own
 */
const registeredMethods: { [ key: string ]: Object } = {}

/**
 * This Plugins-Plugin
 */
function createThisPlugin(): ApiPlugin {
  return {
    id: 'avlevere-api-vue-plugins-plugin',
    name: 'plugins',
    export: {
      hasPlugin,
      subscribe,
      publish,
    }
  }
}

/**
 * Add a plugin.
 */
function registerPlugin(name: string): void {
  if (!hasPlugin(name)) {
    registeredPlugins.push(name)
  }
}

/**
 * Register public methods of plugin to be used with inject()
 */
function registerMethods(name: string, methods: Object): void {
  registeredMethods[name] = methods
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
 * Check if a plugin given by it's name is exists.
 */
export function hasPlugin(name: string): boolean {
  return inArr(name, registeredPlugins)
}

/**
 * Subscribe to an event.
 */
export function subscribe(event: string, callback: Function): void {
  if (isStr(event) && isFunc(callback)) {
    if (!has(registeredEvents, event)) {
      registeredEvents[event] = []
    }
    registeredEvents[event].push(callback)
  }
}

/**
 * Trigger an event.
 */
export async function publish(event: string, payload: any = null): Promise<void> {
  if (has(registeredEvents, event)) {
    for (let i = 0; i < registeredEvents[event].length; i++) {
      await registeredEvents[event][i](payload)
    }
  }
  return Promise.resolve()
}

/**
 * Load Plugins
 */
export async function loadPlugins(plugins: ApiPlugin[]): Promise<ApiPlugin[]> {
  const registered: ApiPlugin[] = [
    createThisPlugin(),
    createImages(),
  ]

  // register plugins
  for (let i = 0; i < plugins.length; i++) {
    if (
      !isObj(plugins[i]) ||
      !has(plugins[i], 'id') ||
      !has(plugins[i], 'name') ||
      !has(plugins[i], 'export')
    ) {
      continue
    }
    registered.push(plugins[i])
    registerPlugin(plugins[i].name)
    registerMethods(plugins[i].name, plugins[i].export)
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