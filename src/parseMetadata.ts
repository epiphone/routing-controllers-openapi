// tslint:disable:no-submodule-imports
import * as _ from 'lodash'
import {
  MetadataArgsStorage,
  RoutingControllersOptions,
} from 'routing-controllers'
import { ActionMetadataArgs } from 'routing-controllers/metadata/args/ActionMetadataArgs'
import { ControllerMetadataArgs } from 'routing-controllers/metadata/args/ControllerMetadataArgs'
import { ParamMetadataArgs } from 'routing-controllers/metadata/args/ParamMetadataArgs'
import { ResponseHandlerMetadataArgs } from 'routing-controllers/metadata/args/ResponseHandleMetadataArgs'

/**
 * All the context for a single route.
 */
export interface IRoute {
  readonly action: ActionMetadataArgs
  readonly controller: ControllerMetadataArgs
  readonly options: RoutingControllersOptions
  readonly params: ParamMetadataArgs[]
  readonly responseHandlers: ResponseHandlerMetadataArgs[]
}

/**
 * Parse routing-controllers metadata into an IRoute objects array.
 */
export function parseRoutes(
  storage: MetadataArgsStorage,
  options: RoutingControllersOptions = {}
): IRoute[] {
  return storage.actions.map((action) => ({
    action,
    controller: _.find(storage.controllers, {
      target: action.target,
    }) as ControllerMetadataArgs,
    options,
    params: _.sortBy(
      storage.filterParamsWithTargetAndMethod(action.target, action.method),
      'index'
    ),
    responseHandlers: storage.filterResponseHandlersWithTargetAndMethod(
      action.target,
      action.method
    ),
  }))
}
