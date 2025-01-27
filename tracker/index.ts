import { toKey, inArr } from '../utils'
import { mainStore } from '../plugin'
import type { InstalledTracker } from './types'
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
const installedTracker: InstalledTracker = [ 'matomo' ]

/**
 * Tracker interface
 */
let tracker: Object = {}

/**
 * Load and configure tracker.
 */
async function init() {
  const config = mainStore.get('addons.tracker');
  const name = toKey(config?.name)
  if (inArr(name, installedTracker)) {
    return import(`./modules/${name}.ts`)
      .then((mod: Object) => {
          tracker = mod
          return tracker.init(config)
        }
      )
      .then(() => {
        //tracker.track()
      })
  }
}

/**
 */
function configTracker(...args: any[]): void {
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
function createTracker(): IApiAddon[] {
  return [{
    name: 'tracker',
    export: {
      configTracker,
      setConsent,
      track,
    },
    init
  }]
}

/**
 * Export module
 */
export {
  createTracker,
  configTracker,
  setConsent,
  track,
}
