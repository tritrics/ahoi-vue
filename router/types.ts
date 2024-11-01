import type { RouteRecordRaw, RouterHistory, RouteComponent } from 'vue-router'
import type { IImmutableStore } from "../types"

export interface IRouteMap {
  [ key: string ]: IRouteNormalized
}

export interface IRouterStore extends IImmutableStore {
  getHistoryMode(): RouterHistory
  getRoute(blueprint: string|false, path: string, meta: Object): RouteRecordRaw
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

/**
 * From vue-router, not exported
 */
declare type Lazy<T> = () => Promise<T>
declare type RawRouteComponent = RouteComponent | Lazy<RouteComponent>

export interface IRouteNormalized {
  meta: Object
  components:  Record<string, RawRouteComponent>
}