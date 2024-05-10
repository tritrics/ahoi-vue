import type { RouteParams } from 'vue-router'
import type { Object } from '../../types'
import type { ILinkModel } from '../models/types'

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

export interface LinkApi {
  source: 'api'
  type: LinkType
  data: ILinkModel
}

export interface LinkRouter {
  source: 'router'
  type: LinkType
  data: RouteParams
}

export interface Attributes {
  to?: Object | string
  href?: string
  class?: string
  target?: string
  disabled?: 'disabled'
}