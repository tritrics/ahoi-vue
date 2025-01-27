import { toPath, isStr, toStr, isUrl, isInt, isTrue } from '../../utils'
import type { Object } from '../../types'

declare global {
  interface Window {
    _paq: any[]
    Piwik: Object
  }
}

/**
 * Configure and load Matomo.
 */
async function init(options: Object) {
  if (!isUrl(options?.host) || !isInt(options?.siteId, 1)) {
    return console.error(`[AHOI] Host and/or siteId are missing for Matomo.`)
  }

  // basic settings
  window._paq = window._paq ?? []
  setConfig(['setTrackerUrl', toPath(options.host, 'matomo.php')])
  setConfig(['setSiteId', options.siteId])

  // additional settings
  if (isTrue(options?.requireConsent)) {
    setConfig(['requireConsent'])
  }
  if (isTrue(options?.disableCookies)) {
    setConfig(['disableCookies'])
  } else if (isTrue(options?.requireCookieConsent)) {
    setConfig(['requireCookieConsent'])
  }
  if (isTrue(options?.enableHeartBeatTimer)) {
    if (isInt(options?.heartBeatTimerInterval, 1)) {
      setConfig(['enableHeartBeatTimer', options.heartBeatTimerInterval])
    } else {
      setConfig(['enableHeartBeatTimer'])
    }
  }

  // load Script
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.src = toPath(options.host, 'matomo.js')
    const head = document.head ?? document.getElementsByTagName('head')[0]
    head.appendChild(script)
    script.onload = resolve
    script.onerror = reject
  })
  .catch((error) => {
    console.error(
      error.target ? 
      `[AHOI] Can't load Matomo from ${error.target.src}. Either the url is wrong or you have an adblocker enabled.` :
      `[AHOI] ${toStr(error)}`
    )
  })
}

/**
 * General function to add any config to Matomo.
 */
function setConfig(params: any[]): void {
  window._paq?.push(params)
}

/**
 * Store user consent, either to general tracking (type = 'tracking') or
 * to cookie (type='cookie')
 */
function setConsent(type: string = 'tracking', setting: boolean = true): void {
  if (type === 'cookie') {
     return setConfig(setting ? ['setCookieConsentGiven'] : ['forgetCookieConsentGiven'])
  }
  setConfig(setting ? ['setConsentGiven'] : ['forgetConsentGiven'])
}

/**
 * Tracking pageview
 */
function track(path?: string, title?: string, referrer?: string) :void {
  const Matomo = window.Piwik.getAsyncTracker()
  if (isStr(referrer, 1)) {
    Matomo.setReferrerUrl(toPath(window.location.origin, referrer))
  }
  if (isStr(path)) {
    Matomo.setCustomUrl(toPath(window.location.origin, path))
  }
  Matomo.trackPageView(title ?? path)
}

/**
 * Export module
 */
export {
  init,
  setConfig,
  setConsent,
  track,
}
