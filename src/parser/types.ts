import type { Object, DateTimeFormat } from "../types"

/**
 * API-plugin-plugin Parser options, not used
 */
export interface ParserOptions {
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

export type ResponseModelTypes = 'info' | 'language' | 'fields' | 'pages' | 'files'

export type LinkTypes = 'page' | 'file' | 'email' | 'tel' | 'anchor' | 'custom'

export type ParserModelTypes = 'string' | 'block' | 'boolean' | 'color' | 'date' | 'datetime' | 'file' | 'html' | 'node' | 'image' | 'info' | 'language' | 'link' | 'markdown' | 'number' | 'option' | 'page' | 'site' | 'string' | 'text' | 'time' | 'user'

export interface ResponseModel {
  type: ResponseModelTypes
  [ key: string ]: any
}

export interface ParserModel {
  type: ParserModelTypes
  value: any
  toString: (options?: Object) => string
  [ key: string ]: any
}