import BaseEntriesModel from './BaseEntries'
import type { IUsersModel } from '../types'

/**
 * Model representing a list of users.
 */
export default class UsersModel extends BaseEntriesModel implements IUsersModel {

  /**
   * Type
   */
  type: 'users' = 'users'
}