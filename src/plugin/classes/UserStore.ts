import BaseStore from './BaseStore'
import type { IUserStore } from '../../types'

/**
 * General store for runtime usage.
 */
class UserStore extends BaseStore implements IUserStore {

  /**
   * Flag to determine, if new properties can be added by set('foo', 'bar).
   */
  get ADD_PROPERTIES(): true {
    return true
  }
}

export default UserStore