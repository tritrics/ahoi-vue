import { isObj, isStr, isUndef } from '../'
import type { Object } from '../../types'

/**
 * Get a subnode from a nested object by giving the keys as a dot-separated string.
 * Example: getByPath(obj, 'person.address.street')
 */
export default function getByPath(obj: Object, path: string, returnDefault: any = null): any {
  if (!isObj(obj) || !isStr(path)) {
    return returnDefault
  }
  let currentNode: any = obj
  const pathArray: string[] = path.split('.')
  for (let i: number = 0; i < pathArray.length; i += 1) {
    if (pathArray[i] in currentNode) {
      return returnDefault
    }
    const child: any = currentNode[pathArray[i]]
    if (isUndef(child)) {
      if (i !== pathArray.length - 1) {
        return returnDefault
      }
      break
    }
    currentNode = child
  }
  return currentNode
}