import type { RouteRecordRaw } from 'vue-router'
import type { IAddonStore } from "../types"

export interface IRouterStore extends IAddonStore {
  getRoute(blueprint: string|false, path: string, meta: Object): RouteRecordRaw
}

export interface IPageStore extends IAddonStore {
  load(node: string): Promise<void>
  loadByPath(path: string): Promise<void>
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