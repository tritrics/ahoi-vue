import type { Object, DateTimeFormat } from "../types"

/**
 * API-plugin-plugin Parser params, not used
 */
export interface ParserParams {
  global?: {
    [ locale: string ]: string|null
  }
  number?: {
    [ fixed: string ]: number|null
  }
  link?: {
    [ router: string ]: boolean
  }
  html?: {
    [ attr: string ]: {
      [ key: string ]: {
        [ key: string ]: string
      }
    }
  }
  text?: {
    [ nl2br: string ]: boolean
  }
  date?: {
    [ format: string ]: DateTimeFormat 
  }
  time?: {
    [ format: string ]: DateTimeFormat
  }
}

export type ParserModelTypes =
  'string' |
  'block' |
  'boolean' |
  'color' |
  'date' |
  'datetime' |
  'file' |
  'html' |
  'node' |
  'image' |
  'info' |
  'language' |
  'languages' |
  'link' |
  'markdown' |
  'number' |
  'option' |
  'page' |
  'site' |
  'string' |
  'text' |
  'thumb' |
  'time' |
  'user'

/**
 * Parser Model
 */
export interface ParserModel {
  $type: ParserModelTypes
  $value: any
  $val: () => any
  $str: (options?: Object) => string
  toString: (options?: Object) => string
  [ key: string ]: any
}