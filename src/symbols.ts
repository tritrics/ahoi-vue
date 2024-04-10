/** * 
 * Allowing type check on inject()
 * @see: https://logaretm.com/blog/type-safe-provide-inject/
 * 
 * import { type InjectionKey } from 'vue'
 * import { parse } from './parser'
 * export const ApiParserParse: InjectionKey<typeof parse> = Symbol('ApiParserParse')
 * 
 * Usage: // type checked
 * import { ApiParserParse } from '../symbols'
 * const parse = inject(ApiParserParse, (json: Object) => json)
 * 
 * Instead of: // no type check
 * const parse = inject('api.parser.parse') as Function
 *    or
 * const parse = inject('api.parser.parse', (json: Object) => json)
 */

