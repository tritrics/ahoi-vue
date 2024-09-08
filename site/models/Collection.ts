import { toInt } from '../../fn'
import type { ICollectionModel } from '../types'
import type { Object } from '../../types'

/**
 * Model representing the collection information in entries models.
 */
export default class CollectionModel implements ICollectionModel {

  /**
   */
  total: number

  /**
   */
  limit: number

  /**
   */
  offset: number

  
  /** */
  constructor(data: Object) {
    this.total = toInt(data.total)
    this.limit = toInt(data.limit)
    this.offset = toInt(data.offset)
  }
  
  /** */
  toString(): string {
    return `${this.total} entries`
  }
}
