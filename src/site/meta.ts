import { each, toStr, toKey, isStr, toLocale, escape } from '../fn'
import { siteOptions } from './index'
import type { Object } from '../types'

/**
 * Set a bunch of common meta elements the easy way and additional values like they are.
 * {
 *   title: string, the page title
 *   brand: string, the website title
 *   keywords: string
 *   description: string
 *   author: string
 *   type: string (f.ex. website)
 *   image: image-instance or url
 *   url: url
 *   locale: locale, normalized to format de_DE
 * }
 */
export function setMeta(obj: Object) {
  setTitle(obj)
  each(obj, (value: string, key: string) => {
    switch(toKey(key)) {
      case 'brand':
      case 'title':
        break
      case 'keywords':
        setMetaElement('keywords', value)
        break;
      case 'description':
        setMetaElement('description', value)
        setMetaElement('og:description', value)
        setMetaElement('twitter:card', value)
        break
      case 'type':
        setMetaElement('og:type', value)
        break;
      case 'author':
        setMetaElement('og:author', value)
        break;
      case 'image':
        setMetaElement('og:image', value)
        break;
      case 'url':
        setMetaElement('og:url', value)
        break;
      case 'locale':
        setMetaElement('og:locale', toLocale(value, '_'))
        break;
      default:
        setMetaElement(key, value)
    }
  })
}

/**
 * Changing document title element.
 */
function setTitle(obj: Object) {
  let change = false
  if (isStr(obj?.title)) {
    siteOptions.set('title', obj.title)
    change = true
  }
  if (isStr(obj?.brand)) {
    siteOptions.set('brand', obj.brand)
    change = true
  }
  if (change) {
    const parts: string[] = []
    if (isStr(siteOptions.get('title'), 1)) {
      parts.push(siteOptions.get('title'))
    }
    if (isStr(siteOptions.get('brand'), 1)) {
      parts.push(siteOptions.get('brand'))
    }
    const title = parts.join(siteOptions.get('title_separator'))
    setTitleElement(title)
    setMetaElement('og:title', title)
    setMetaElement('og:site_name', siteOptions.get('brand'))
  }
}

/**
 * Change document title
 */
function setTitleElement(value: string) {
  const title = escape(toStr(value))
  if (document.title !== title) {
    document.title = title
  }
}

/**
 * Change or add meta element.
 */
function setMetaElement(key: string, value: string) {
  const name: string = toKey(key)
  const type: 'name'|'property' = name.startsWith('og:') ? 'property' : 'name'
  const content: string = escape(toStr(value))
  const nodes = document.head.querySelectorAll(`meta[${type}="${name}"]`)
  if (nodes.length === 0) {
    const meta = document.createElement('meta')
    meta.setAttribute(type, name)
    meta.setAttribute('content', content)
    document.getElementsByTagName('head')[0].appendChild(meta as HTMLHeadElement)
  } else {
    nodes.forEach(node => {
      if (node.getAttribute('content') !== content) {
        node.setAttribute('content', content)
      }
    })
  }
}