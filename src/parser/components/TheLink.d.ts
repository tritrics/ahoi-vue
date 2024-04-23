import type { RouteParams } from 'vue-router'
import type { Object, ParserModel } from '../../types'

export interface Props {
  to: string | RouteParams | ParserModel
  disabled?: boolean
}

export type LinkType = 'page' | 'url' | 'email' | 'tel' | 'file' | 'anchor' | 'custom'

export type ElemType = 'a' | 'router-link'

export interface LinkString {
  source: 'string'
  type: LinkType
  data: string
}

export interface LinkParser {
  source: 'parser'
  type: LinkType
  data: ParserModel
}

export interface LinkRouter {
  source: 'router'
  type: LinkType
  data: RouteParams
}

export interface LinkNone {
  source: 'none'
  type: LinkType
}

export interface Attributes {
  to?: Object | string
  href?: string
  class?: string
  target?: string
  disabled?: 'disabled'
}