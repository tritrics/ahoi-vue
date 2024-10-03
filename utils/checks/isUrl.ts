import { lower, isStr, isIP } from '../'

/**
 * Check, if value is a valid url.
 * http(s)://(localhost | IP | second-level.top-level)(/foo/bar)
 * Validation doesn't allow http://foo, which is valid due to specifications.
 */
export default function isUrl(val: any): val is string {
  if (!isStr(val, 1)) {
    return false
  }
  try {
    const url = new URL(val)
    const hostname = lower(url.hostname)
    const regHost = /^http(s)?:\/\//
    const regDomain = /^[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/
    return regHost.test(val) && (regDomain.test(hostname) || hostname === 'localhost' || isIP(hostname))
  } catch(e) { 
    return false;
  }
}