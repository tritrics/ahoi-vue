import { escape, toKey, toStr, isStr, isEmpty } from '../fn'
import { store } from '../api/store'
import type { IApiAddon } from '../types'

/**
 * Watch-method to set lang in html-node.
 */
function setLang(): void {
  setMeta('lang', store.lang)
}

/**
 * Watch-method to set meta locale.
 */
function setLocale(): void {
  setMeta('og:locale', store.locale)
}

/**
 * Watch-method to set page title.
 */
function setTitle(): void {
  const parts: string[] = []
  if (isStr(store.title, 1)) {
    parts.push(store.title)
  }
  if (isStr(store.brand, 1)) {
    parts.push(store.brand)
    setMeta('og:site_name', store.brand)
  }
  const title = parts.join(store.separator)
  setMeta('title', title)
  setMeta('og:title', title)
}

/**
 * Watch-method to set meta keywords.
 */
function setKeywords(): void {
  setMeta('keywords', store.keywords)
}

/**
 * Watch-method to set meta description.
 */
function setDescription(): void {
  setMeta('description', store.description)
  setMeta('og:description', store.description)
  setMeta('twitter:card', store.description)
}

/**
 * Watch-method to set meta image.
 */
function setImage(): void {
  setMeta('og:image', store.image)
}

/**
 * Watch-method to set meta url.
 */
function setUrl(): void {
  setMeta('og:url', store.url)
}

/**
 * Change or add meta element.
 */
export function setMeta(key: string, value: string) {
  const name: string = toKey(key)
  const content: string = escape(toStr(value))
  switch(name) {
    case 'title':
      if (document.title !== content) {
        document.title = content
      }
      break
    case 'lang':
      if (document.documentElement.getAttribute('lang') !== content) {
        document.documentElement.setAttribute('lang', content)
      }
      break
    default: {
      const type: 'name'|'property' = name.startsWith('og:') ? 'property' : 'name'
      const nodes = document.head.querySelectorAll(`meta[${type}="${name}"]`)
      if (nodes.length === 0) {
        if (!isEmpty(content)) {
          const meta = document.createElement('meta')
          meta.setAttribute(type, name)
          meta.setAttribute('content', content)
          document.getElementsByTagName('head')[0].appendChild(meta as HTMLHeadElement)
        }
      } else {
        nodes.forEach(node => {
          if (node.getAttribute('content') !== content) {
            node.setAttribute('content', content)
          }
        })
      }
    }
  }
}

/**
 * Plugin
 */
export function createMeta(): IApiAddon {
  return {
    name: 'meta',
    init: (): void => {
      store.watch('lang', setLang, { immediate: true })
      store.watch('locale', setLocale, { immediate: true })
      store.watch(['brand', 'title'], setTitle, { immediate: true })
      store.watch('keywords', setKeywords, { immediate: true })
      store.watch('description', setDescription, { immediate: true })
      store.watch('image', setImage, { immediate: true })
      store.watch('url', setUrl, { immediate: true })
    },
    export: {
      setMeta
    }
  }
}