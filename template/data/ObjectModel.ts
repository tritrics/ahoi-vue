import { has, isObj, isArr, isStr } from '../../utils'
import FieldsModel from './FieldsModel'
import { parse } from '../index'
import { createLinkByValues } from '../models/LinkModel'
import type { IObjectModel, ILinkModel, ILanguageModel } from '../types'
import type { Object, JSONObject } from '../../types'

/**
 * Base model for models with fields.
 */
export default class ObjectModel extends FieldsModel implements IObjectModel {
  
  /**
   * Object with meta data
   */
  meta?: Object

  /**
   * Link model
   */
  link?: ILinkModel

  /**
   * Languages in multilanguage enviroments
   */
  languages?: ILanguageModel[]

  /** */
  constructor(obj: JSONObject) {
    super(obj)
    if (isObj(obj.meta)) {
      this.meta = obj.meta as Object
      if (isStr(obj.meta?.modified, 1)) {
        this.meta.modified = new Date(this.meta.modified)
      }
    }
    if (isStr(this.meta?.href, 1)) {
      this.link = createLinkByValues(
        obj.type === 'file' ? 'file' : 'page',
        this.meta.title ?? this.meta.href,
        this.meta.href
      )
    }
    if (has(obj, 'languages')) {
      this.languages = parse(obj.languages) as ILanguageModel[]
    }
  }

  /**
   * Checking empty value.
   */
  isEmpty(): boolean {
    return !isObj(this.meta)
  }

  /**
   * Get languages sorted after 'lang' or 'title',
   * optional with default language first.
   */
  sortedLanguages(defaultFirst: boolean = false, byLang: boolean = false): ILanguageModel[] {
    let res: ILanguageModel[] = []
    if (isArr(this.languages)) {
      const index = byLang ? 'lang' : 'title'
      res = [ ...this.languages ].sort((a, b) => {
        if (a.meta?.[index] && b.meta?.[index]) {
          return (a.meta[index] < b.meta[index]) ? -1 : 1
        }
        return 0
      })
      if (defaultFirst) {
        res.sort((a, b) => {
          if (a.isDefault()) return -1
          if (b.isDefault()) return 1
          return 0
        })
      }
    }
    return res
  }
}