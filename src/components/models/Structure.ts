import BaseEntriesModel from './BaseEntries'
import type { IStructureModel } from './types'

export default class StructureModel extends BaseEntriesModel implements IStructureModel {
  type: 'structure' = 'structure'
}