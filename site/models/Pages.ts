import BaseEntriesModel from './BaseEntries'
import type { IPagesModel } from '../types'

export default class PagesModel extends BaseEntriesModel implements IPagesModel {
  type: 'pages' = 'pages'
}