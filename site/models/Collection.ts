import { toInt } from '../../fn'
import type { ICollectionModel } from '../types'
import type { Object } from '../../types'

/**
 * Model representing the collection information in entries models.
 */
export default class CollectionModel implements ICollectionModel {

  /**
   * Position of this set of entries in the range of total entries
   */
  set: number

  /**
   * Max entries in this set
   */
  limit: number

  /**
   * Count of entries in this set
   */
  count: number

  /**
   * Number of the first entry in this set in the range of total entries
   */
  start: number

  /**
   * Number of the last entry in this set in the range of total entries
   */
  end: number

  /**
   * Number of sets
   */
  sets: number

  /**
   * Total count of entries
   */
  total: number
  
  /** */
  constructor(data: Object) {
    this.count = toInt(data.count)
    this.set = toInt(data.set)
    this.limit = toInt(data.limit)
    this.start = toInt(data.start)
    this.end = toInt(data.end)
    this.sets = toInt(data.sets)
    this.total = toInt(data.total)
  }

  /**
   * Flag to check, if there ist a previous set
   */
  hasPrev(count: number = 1): boolean {
    return (this.set - count) >= 0
  }

  /**
   * Flag to check, if there is a next set
   */
  hasNext(count: number = 1): boolean {
    return (this.set + count) <= this.sets
  }

  /**
   * Get the number of the previous set
   */
  prev(count: number = 1): number {
    return this.hasPrev(count) ? this.set - count : this.set
  }

  /**
   * Get the number of the next set
   */
  next(count: number = 1): number {
    return this.hasNext(count) ? this.set + count : this.set
  }
  
  /** */
  toString(): string {
    return `entries ${this.start} to ${this.end} from ${this.total}`
  }
}
