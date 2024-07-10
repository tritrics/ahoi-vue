import { each } from '../../fn'
import BaseEntriesModel from './BaseEntries'
import type { IOptionsModel, IOptionModel } from '../types'

/**
 * Model representing a list of select-options.
 */
export default class PageModel extends BaseEntriesModel implements IOptionsModel {
  
  /**
   * Type
   */
  type: 'options' = 'options'

  /**
   * Getter for value as string
   */
  str(): string {
    const res: string[] = []
    each(this.entries, (model: IOptionModel) => {
      res.push(model.str())
    })
    return res.join(', ')
  }
}