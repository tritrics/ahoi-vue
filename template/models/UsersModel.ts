import EntriesModel from '../data/EntriesModel'
import type { IUsersModel } from '../types'

/**
 * Model representing a list of users.
 */
export default class UsersModel extends EntriesModel implements IUsersModel {

  /**
   * Type
   */
  type: 'users' = 'users'
}