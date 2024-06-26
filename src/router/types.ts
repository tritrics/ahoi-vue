export interface IRouterRoutes {
  [ key: string ]: string
}

export interface IRouterComponentsMap {
  default: string
  [ key: string ]: string
}

export interface IRouterOptions {
  history?: 'hash' | 'web' | 'memory',
  error: string
}