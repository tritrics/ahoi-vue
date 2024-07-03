import { isStr } from '../'

/**
 * Check, if value is a valid url.
 */
export default function isUrl(val: any): val is string {
  try { 
    return isStr(val) && Boolean(new URL(val))
  } catch(e) { 
    return false;
  }
}