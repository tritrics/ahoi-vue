import { toStr } from '../../utils'
import BaseModel from './Base'
import { createLinkByValues } from './Link'
import type { ILinkModel, ITranslationModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a translation link.
 */
export default class TranslationModel extends BaseModel implements ITranslationModel {

  /**
   * Type
   */
  type: 'translation' = 'translation'

  /**
   * Meta values, extended link meta
   */
  meta: {
    slug: string
    href: string
    node: string
    title: string
  }

  /**
   * The link model to link the model of this language
   */
  link: ILinkModel

  /** */
  constructor(obj: JSONObject) {
    super(toStr(obj.lang))
    this.link = createLinkByValues('page', obj.title, obj.href)
    this.meta = {
      slug: obj.slug,
      href: obj.href,
      node: obj.node,
      title: obj.title,
    }
  }
}