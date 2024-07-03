import type { RouteParams } from 'vue-router'
import type { Object } from '../../types'

export interface Props {
  to: string | RouteParams | ParserModel
  disabled?: boolean
}

export interface Attributes {
  to?: Object | string
  href?: string
  class?: string
  target?: string
  disabled?: 'disabled'
}

export interface ILinkA {
  elem: 'a',
  type: LinkType
  href: string
  to: null
  title: string
}

export interface ILinkRouter {
  elem: 'router-link'
  type: 'page'
  href: null
  to: ILinkRouterPath | ILinkRouterName
  title: string
}

type LinkType = 'page' | 'url' | 'email' | 'tel' | 'file' | 'anchor' | 'custom'

interface ILinkRouterPath {
  path: string
  [ key: string ]: string|Object
}

interface ILinkRouterName {
  name: string
  [ key: string ]: string|Object
}