// tslint:disable:no-submodule-imports
import * as _ from 'lodash'
import * as oa from 'openapi3-ts'
import {
  getMetadataArgsStorage,
  MetadataArgsStorage,
  RoutingControllersOptions
} from 'routing-controllers'
import { ActionMetadataArgs } from 'routing-controllers/metadata/args/ActionMetadataArgs'

import { applyParamConverters, defaultParamConverters } from './converters'

export function routingControllersToSpec(
  storage?: MetadataArgsStorage,
  options: RoutingControllersOptions = {},
  info: oa.InfoObject = { title: '', version: '1.0.0' }
): oa.OpenAPIObject {
  storage = storage || getMetadataArgsStorage()

  return {
    components: { schemas: {} },
    info,
    openapi: '3.0.0',
    paths: getPaths(storage, options)
  }
}

function getPaths(
  storage: MetadataArgsStorage,
  options: RoutingControllersOptions
): oa.PathObject {
  const actions = storage.actions.map(action => {
    const controller = _.find(storage.controllers, { target: action.target })
    const route = (options.routePrefix || '') + controller!.route + action.route
    const operation = getOperation(action, storage, options)

    return { [route]: { [action.type]: operation } }
  })

  // @ts-ignore: spread operator
  return _.merge(...actions)
}

function getOperation(
  action: ActionMetadataArgs,
  storage: MetadataArgsStorage,
  options: RoutingControllersOptions
) {
  const defaultOperation: oa.OperationObject = {
    operationId: `${action.target.name}.${action.method}`,
    responses: { 200: { content: { 'application/json': {} } } }, // TODO handle HTTPStatus and ContentType
    summary: _.capitalize(_.startCase(action.method)),
    tags: [getControllerTag(action.target)]
  }

  const params = storage.filterParamsWithTargetAndMethod(
    action.target,
    action.method
  )

  // TODO handle responseHandlerMetadata:
  // const responseHandlers = storage.filterResponseHandlersWithTargetAndMethod(
  //   action.target,
  //   action.method
  // )

  const converters = { ...defaultParamConverters }

  return {
    ...defaultOperation,
    ...applyParamConverters(params, converters) // TODO handle required global
  }
}

/**
 * Given a controller class, return a OpenAPI Schema tag.
 */
function getControllerTag(controller: any): string {
  return _.startCase(controller.name.replace(/Controller$/, ''))
}

// /**
//  * Return a list of path parameter objects parsed from given path string.
//  * @param path Express-style path, e.g. '/users/:id/'
//  */
// function parsePathParameters (path: string): [string, oa.ParameterObject[]] {
//   const params = path.match(/:[A-Za-z0-9_]+/gi) || []
//   const paramObjects = params.map((p) => {
//     const name = p.substr(1)
//     path = path.replace(p, `{${name}}`)

//     const paramObj: oa.ParameterObject = {
//       in: 'path',
//       name,
//       required: true,
//       schema: {type: 'string'}
//     }
//     return paramObj
//   })

//   return [path, paramObjects]
// }
