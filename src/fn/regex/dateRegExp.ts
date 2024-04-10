import { regEsc } from '../'

const find = [
  [ 'yyyy', '(?<y>\\d{4})' ],
  [ 'yy',   '(?<y>\\d{2})' ],
  [ 'mm',   '(?<m>\\d{2})' ],
  [ 'm',    '(?<m>\\d{1,2})' ],
  [ 'dd',   '(?<d>\\d{2})' ],
  [ 'd',    '(?<d>\\d{1,2})' ],
  [ 'hh',   '(?<h>\\d{2})' ],
  [ 'h',    '(?<h>\\d{1,2})' ],
  [ 'ii',   '(?<i>\\d{2})' ],
  [ 'i',    '(?<i>\\d{1,2})'],
  [ 'ss',   '(?<i>\\d{2})' ],
  [ 's',    '(?<i>\\d{1,2})']
] 

/**
 * Create a regex for dates
 */
export default function dateRegExp (format: string = 'yyyy-mm-dd'): RegExp {
  let res: string = regEsc(format.toLowerCase())
  for (let i = 0; i < find.length; i++) {
    res = res.replace(find[i][0], `%${i}%`)
  }
  for (let i = 0; i < find.length; i++) {
    res = res.replace(`%${i}%`, find[i][1])
  }
  return new RegExp(res)
}