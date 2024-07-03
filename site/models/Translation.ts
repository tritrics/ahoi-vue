import { toStr } from '../../fn'
import BaseModel from './Base'
import type { ILinkModel, ITranslationModel } from './types'
import { createLinkByValues } from './Link'
import type { JSONObject } from '../../types'

export default class TranslationModel extends BaseModel implements ITranslationModel {
  type: 'translation' = 'translation'

  meta: {
    slug: string
    href: string
    node: string
    title: string
  }

  link: ILinkModel

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