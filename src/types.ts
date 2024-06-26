export type * from './fn/types'
export type * from './form/types'
export type * from './i18n/types'
export type * from './meta/types'
export type * from './plugin/types'
export type * from './router/types'
export type * from './site/types'

declare global {
  interface Window {
    log: Function
  }
  const log:  Function
}