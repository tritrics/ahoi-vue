import type { RouteRecordRaw, RouterHistory } from 'vue-router'
import type { IAddonStore } from "../types"

export interface IRouterStore extends IAddonStore {
  getHistoryMode(): RouterHistory
  getRoute(blueprint: string|false, path: string, meta: Object): RouteRecordRaw
}

export interface IPageStore extends IAddonStore {
  commit(): void
  getBlueprint(): string|undefined
  load(node: string, commit: boolean): Promise<void>
  loadByPath(path: string, commit: boolean): Promise<void>
}

export type IRouteOptions = string | IRouteOptionsComponent | IRouteOptionsComponents

interface IRouteOptionsComponent extends Object {
  component: string
  [ key: string ]: any
}

interface IRouteOptionsComponents extends Object {
  components: Object
  [ key: string ]: any
}

export interface IRouteNormalized {
  meta: Object
  components: {
    [ key: string ]: string
  }
}