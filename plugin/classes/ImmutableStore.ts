import BaseStore from './BaseStore'
import type { IImmutableStore } from '../../types'

/**
 * Basic store for use by addons.
 */
class ImmutableStore extends BaseStore implements IImmutableStore {

  /**
   * Flag to determine, if new properties can be added by set('foo', 'bar).
   */
  get ADD_PROPERTIES(): false {
    return false
  }
}

export default ImmutableStore