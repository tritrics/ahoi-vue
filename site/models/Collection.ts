import { toInt } from '../../fn'
import type { ICollectionModel } from '../types'
import type { Object } from '../../types'

export default class CollectionModel implements ICollectionModel {
  set: number

  limit: number

  count: number

  start: number

  end: number

  sets: number

  total: number
  
  constructor(data: Object) {
    this.count = toInt(data.count)
    this.set = toInt(data.set)
    this.limit = toInt(data.limit)
    this.start = toInt(data.start)
    this.end = toInt(data.end)
    this.sets = toInt(data.sets)
    this.total = toInt(data.total)
  }

  hasPrev(count: number = 1): boolean {
    return (this.set - count) >= 0
  }

  hasNext(count: number = 1): boolean {
    return (this.set + count) <= this.sets
  }

  prev(count: number = 1): number {
    return this.hasPrev(count) ? this.set - count : this.set
  }

  next(count: number = 1): number {
    return this.hasNext(count) ? this.set + count : this.set
  }
  
  toString(): string {
    return `entries ${this.start} to ${this.end} from ${this.total}`
  }
}
