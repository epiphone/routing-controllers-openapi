// tslint:disable:no-submodule-imports
import {
  MetadataArgsStorage,
  RoutingControllersOptions,
} from 'routing-controllers'
import { ActionMetadataArgs } from 'routing-controllers/types/metadata/args/ActionMetadataArgs'
import { ControllerMetadataArgs } from 'routing-controllers/types/metadata/args/ControllerMetadataArgs'
import { ParamMetadataArgs } from 'routing-controllers/types/metadata/args/ParamMetadataArgs'
import { ResponseHandlerMetadataArgs } from 'routing-controllers/types/metadata/args/ResponseHandleMetadataArgs'
import { importClassesFromDirectories } from './importClassesFromDirectories'

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
  // import all controllers and middlewares and error handlers (new way)
  if (options && options.controllers && options.controllers.length) {
    let controllerClasses: Function[];
    controllerClasses = (options.controllers as any[]).filter(controller => controller instanceof Function);
    const controllerDirs = (options.controllers as any[]).filter(controller => typeof controller === 'string');
    controllerClasses.push(...importClassesFromDirectories(controllerDirs));
    options.controllers = controllerClasses;
  }
  
  return storage.actions.map((action) => ({
    action,
    controller: storage.controllers.find(
      (c) => c.target === action.target
    ) as ControllerMetadataArgs,
    options,
    params: storage
      .filterParamsWithTargetAndMethod(action.target, action.method)
      .sort((a, b) => a.index - b.index),
    responseHandlers: storage.filterResponseHandlersWithTargetAndMethod(
      action.target,
      action.method
    ),
  }))
}
