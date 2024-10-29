import { toKey, inArr } from '../utils'
import { apiStore } from '../plugin'
import type { Object, IApiAddon } from '../types'

declare global {
  interface Window {
    _paq: any[]
    Piwik: Object
  }
}

/**
 * Tracker types
 */
const installedTracker: string[] = [ 'matomo' ]

/**
 * Tracker interface
 */
let tracker: Object = {}

/**
 * Load and configure tracker.
 */
async function init() {
  const options = apiStore.get('addons.tracker');
  const name = toKey(options?.name)
  if (inArr(name, installedTracker)) {
    return import(`./modules/${name}.ts`)
      .then((mod: Object) => {
          tracker = mod
          return tracker.init(options)
        }
      )
      .then(() => {
        //tracker.track()
      })
  }
}

/**
 */
function setConfig(...args: any[]): void {
  tracker?.setConfig(...args)
}

/**
 */
function setConsent(...args: any[]): void {
  tracker?.setConsent(...args)
}

/**
 */
function track(...args: any[]): void {
  tracker?.track(...args)
}

/**
 */
export function createTracker(): IApiAddon[] {
  return [{
    name: 'tracker',
    export: {
      setConfig,
      setConsent,
      track,
    },
    init
  }]
}

/**
 * Export module
 */
export default {
  setConfig,
  setConsent,
  track,
}
