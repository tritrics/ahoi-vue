import type { Object } from '../types'
import type { Ref, WatchCallback, WatchOptions } from 'vue'

export interface IStore {
  get(key: string): any
  ref(key: string): Ref
  set(key: string, val: any): void
  setOptions(obj: Object): void
  watch<T>(source: string|string[], callback: WatchCallback<T>, options?: WatchOptions): Function
}