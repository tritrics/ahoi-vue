import { isInt, regEsc } from '../'

/**
 * Create a test-regex for numbers
 */
export default function numberRegExp (decimals: number, decPoint: string = '.'): RegExp {
  let res: string = '^(\\d)*' // thousandSep-test: '^\\d{1,3}([,]?\\d{3})*'
  if (isInt(decimals, 1)) {
    /*eslint-disable-next-line no-useless-escape*/
    res += `(${regEsc(decPoint)}\d{0,${decimals}})?`
  } else if (decimals === '*') {
    /*eslint-disable-next-line no-useless-escape*/
    res += `(${regEsc(decPoint)}\d*)?`
  }
  return new RegExp(res +'$')
}