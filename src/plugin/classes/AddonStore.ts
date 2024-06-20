import BaseStore from './BaseStore'
import type { IAddonStore } from '../../types'

/**
 * Basic store for use by addons.
 */
class AddonStore extends BaseStore implements IAddonStore {

  /**
   * Flag to determine, if new properties can be added by set('foo', 'bar).
   */
  get ADD_PROPERTIES(): false {
    return false
  }
}

export default AddonStore