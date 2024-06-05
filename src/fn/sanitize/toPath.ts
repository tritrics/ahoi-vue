import { each, toStr, isNum, isStr, isArr, trim, isUrl } from '../'

/**
 * Creates a slash-separated path or url from any kind of parameters.
 * Adds a leading slash, if it's not an url.
 */
export default function toPath(...args: any[]): string {
  const res: string[] = []
  each(args, (arg: any) => {
    if(isNum(arg)) {
      arg = toStr(arg)
    } else if (isStr(arg)) {
      arg = trim(arg, true, true, '/')
    } else if (isArr(arg)) {
      arg = toPath(...arg)
    }
    if (isStr(arg, 1)) {
      res.push(encodeURI(arg))
    }
  })
  const path: string = res.join('/')
  return isUrl(path) ? path : `/${path}`
}