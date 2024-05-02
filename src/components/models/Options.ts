import BaseEntriesModel from './BaseEntries'
import type { IOptionsModel } from './types'

export default class PageModel extends BaseEntriesModel implements IOptionsModel {
  type: 'options' = 'options'
}