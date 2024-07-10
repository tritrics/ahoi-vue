import BaseEntriesModel from './BaseEntries'
import type { IUsersModel } from '../types'

export default class UsersModel extends BaseEntriesModel implements IUsersModel {
  type: 'users' = 'users'
}