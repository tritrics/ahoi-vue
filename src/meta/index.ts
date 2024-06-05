import { escape, each, toKey, toStr, isStr, isEmpty } from '../fn'
import { stores } from '../stores'
import type { IApiAddon, Object } from '../types'

/**
 * Setting a single or a bunch of meta values.
 * use: setMeta({ key: val }) or setMeta(key, val)
 */
export function setMeta(mixed: Object|string, val: string = ''): void {
  const meta = isStr(mixed) ? { mixed: val } : mixed
  each(meta, (val: string, key: string) => {
    const name: string = toKey(key)
    switch(name) {
      case 'description':
        write('description', val)
        write('og:description', val)
        write('twitter:card', val)
        break
      case 'locale':
        write('og:locale', val)
        break
      case 'image':
        write('og:image', val)
        break
      case 'title': {
        const parts: string[] = []
        if (isStr(val, 1)) {
          parts.push(val)
        }
        if (isStr(stores.global.get('brand'), 1)) {
          parts.push(stores.global.get('brand'))
          write('og:site_name', stores.global.get('brand'))
        }
        const title = parts.join(stores.global.get('separator'))
        write('title', title)
        write('og:title', title)
        break
      }
      case 'url':
        write('og:url', val)
        break
      default:
        write(name, val)
    }
  })
}

/**
 * Manipulate HTML
 */
function write(name: string, value: string): void {
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
 * Addon
 */
export function createMeta(): IApiAddon {
  return {
    name: 'meta',
    init: (): void => {
      stores.global.watch('lang', (val: string) => setMeta({ lang: val }), { immediate: true })
      stores.global.watch('locale', (val: string) => setMeta({ locale: val }), { immediate: true })
      stores.global.watch('brand', () => setMeta({ title: '' }), { immediate: true })
    },
    export: {
      setMeta
    }
  }
}