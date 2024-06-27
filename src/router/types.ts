export interface IRouterRoutes {
  [ key: string ]: string
}

export interface IRouterComponentsMap {
  default: string
  [ key: string ]: string
}

export interface IRouterOptions {
  history?: 'hash' | 'web' | 'memory',
  template?: string
  notfound: string
}