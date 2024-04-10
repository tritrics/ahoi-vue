import { isStr, regEsc } from '../'

/**
 * Trim a string, like PHP from the following chars:
 * 
 * ' ' an ordinary space
 * \t a tab
 * \n a new line (line feed)
 * \r a carriage return
 * \0 the NUL-byte
 * \v a vertical tab
 * chars = additional (!) characters to trim
 */
export default function trim(val: string, left: boolean = true, right: boolean = true, chars: string = ''): string {
  if (isStr(val)) {
    const search = regEsc(` \r\n\t\0\v${chars}`)
    const reg = []
    if (left) reg.push(`^[${search}]+`)
    if (right) reg.push(`[${search}]+$`)
    return val.replace(new RegExp(reg.join('|'), 'g'), '')
  }
  return ''
}