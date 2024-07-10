import { each } from '../../fn'
import BaseEntriesModel from './BaseEntries'
import type { IOptionsModel, IOptionModel } from '../types'

export default class PageModel extends BaseEntriesModel implements IOptionsModel {
  type: 'options' = 'options'

  str(): string {
    const res: string[] = []
    each(this.entries, (model: IOptionModel) => {
      res.push(model.str())
    })
    return res.join(', ')
  }
}