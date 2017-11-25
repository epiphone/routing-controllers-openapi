// tslint:disable:no-submodule-imports
import * as _ from 'lodash'
import * as oa from 'openapi3-ts'
import 'reflect-metadata'
import {
  MetadataArgsStorage,
  RoutingControllersOptions
} from 'routing-controllers'
import { ActionMetadataArgs } from 'routing-controllers/metadata/args/ActionMetadataArgs'
import { ControllerMetadataArgs } from 'routing-controllers/metadata/args/ControllerMetadataArgs'
import { ParamMetadataArgs } from 'routing-controllers/metadata/args/ParamMetadataArgs'
import { ResponseHandlerMetadataArgs } from 'routing-controllers/metadata/args/ResponseHandleMetadataArgs'

export interface IRoute {
  readonly action: ActionMetadataArgs
  readonly controller: ControllerMetadataArgs
  readonly options: RoutingControllersOptions
  readonly params: ParamMetadataArgs[]
  readonly responseHandlers: ResponseHandlerMetadataArgs[]
}

export function routingControllersToSpec(
  storage: MetadataArgsStorage,
  options: RoutingControllersOptions = {},
  info: oa.InfoObject = { title: '', version: '1.0.0' }
): oa.OpenAPIObject {
  const routes = parseRoutes(storage, options)
  const routePaths = routes.map(route => ({
    [getFullPath(route)]: {
      [route.action.type]: getOperation(route)
    }
  }))

  // @ts-ignore: array spread
  const paths = _.merge(...routePaths)

  const spec = {
    components: { schemas: {} },
    info,
    openapi: '3.0.0',
    paths
  }

  return spec
}

export function parseRoutes(
  storage: MetadataArgsStorage,
  options: RoutingControllersOptions
): IRoute[] {
  return storage.actions.map(action => ({
    action,
    controller: _.find(storage.controllers, { target: action.target })!,
    options,
    params: storage.filterParamsWithTargetAndMethod(
      action.target,
      action.method
    ),
    responseHandlers: storage.filterResponseHandlersWithTargetAndMethod(
      action.target,
      action.method
    )
  }))
}

/**
 * Return the OpenAPI Operation object for given route.
 */
export function getOperation(route: IRoute): oa.OperationObject {
  const operation: oa.OperationObject = {
    operationId: `${route.action.target.name}.${route.action.method}`,
    parameters: [...getPathParams(route), ...getQueryParams(route)],
    requestBody: getRequestBody(route) || undefined,
    responses: {
      200: {
        // TODO handle HTTPStatus and ContentType
        content: { 'application/json': {} },
        description: 'Successful response'
      }
    },
    summary: _.capitalize(_.startCase(route.action.method)),
    tags: getTags(route)
  }

  // clean empty and undefined properties:
  return _.omitBy(operation, _.isEmpty) as oa.OperationObject
}

/**
 * Return the full OpenAPI-formatted path of given route.
 */
export function getFullPath(route: IRoute): string {
  const { action, controller, options } = route
  const path = (options.routePrefix || '') + controller.route + action.route
  return path.replace(/:([A-Za-z0-9_]+)/gi, '{$1}')
}

/**
 * Return the path parameters of given route.
 *
 * Path parameters are first parsed from the path string itself, and then
 * supplemented with possible @Param() decorator values.
 */
export function getPathParams(route: IRoute): oa.ParameterObject[] {
  const path = getFullPath(route)
  const paramNames = _.map(path.match(/{[A-Za-z0-9_]+}/gi), d => d.slice(1, -1))

  return paramNames.map(name => {
    const param = {
      in: 'path',
      name,
      required: true,
      schema: { type: 'string' } // TODO parse type from param regexp suffix?
    }

    const meta = _.find(route.params, { name, type: 'param' })
    if (meta) {
      const typeCls = getParamTypes(meta.object, meta.method)[meta.index]
      const type = _.isNumber(typeCls.prototype) ? 'number' : 'string' // TODO improve handling
      param.required = isRequired(meta, route.options)
      param.schema.type = type
    }

    return param
  })
}

/**
 * Return the query parameters of given route.
 * @param route
 */
export function getQueryParams(route: IRoute): oa.ParameterObject[] {
  // TODO handle individual @QueryParam decorators
  const meta = _.find(route.params, { type: 'queries' })
  if (meta) {
    const type = getParamTypes(meta.object, meta.method)[meta.index]
    return [
      {
        in: 'query',
        name: type.name,
        required: meta.required !== false, // TODO handle global required option
        schema: { $ref: '#/components/schemas/' + type.name }
      }
    ]
  }
  return []
}

/**
 * Return the requestBody of given route, if it has one.
 */
export function getRequestBody(route: IRoute): oa.RequestBodyObject | void {
  const meta = _.find(route.params, { type: 'body' })
  if (meta) {
    const type = getParamTypes(meta.object, meta.method)[meta.index]
    return {
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/' + type.name } // TODO reuse
        }
      },
      description: type.name,
      required: isRequired(meta, route.options)
    }
  }
}

/**
 * Return OpenAPI Schema tags for given route.
 */
export function getTags(route: IRoute): string[] {
  return [_.startCase(route.controller.target.name.replace(/Controller$/, ''))]
}

/**
 * Return true if given metadata argument is required, checking for global setting.
 */
function isRequired(
  meta: { required?: boolean },
  options: RoutingControllersOptions
) {
  const globalRequired = _.get(options, 'defaults.paramOptions.required')
  return globalRequired ? meta.required !== false : !!meta.required
}

function getParamTypes(target: object, property: string) {
  return Reflect.getMetadata('design:paramtypes', target, property)
}
