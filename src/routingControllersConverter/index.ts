// tslint:disable:ban-types no-submodule-imports
import * as _ from 'lodash'
import * as oa from 'openapi3-ts'
import {
  getMetadataArgsStorage,
  MetadataArgsStorage,
  RoutingControllersOptions
} from 'routing-controllers'

import { defaultParamConverters, parseParamMetadata } from './converters'

const PATH_PARAM_REGEX = /:([A-Za-z0-9_]+)/gi

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
    const path = (options.routePrefix || '') + controller!.route + action.route

    const defaultOperation: oa.OperationObject = {
      operationId: `${action.target.name}.${action.method}`,
      parameters: _.map(path.match(PATH_PARAM_REGEX), param => ({
        in: 'path',
        name: param.replace(':', ''),
        required: true,
        schema: { type: 'string' } // TODO parse type from param regexp suffix?
      })),
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
    const items = params.map(d => parseParamMetadata(d, converters))
    const operation = mergeOperationItems([defaultOperation, ...items])

    const schemaPath = path.replace(PATH_PARAM_REGEX, '{$1}')
    return { [schemaPath]: { [action.type]: operation } }
  })

  // @ts-ignore: spread operator
  return _.merge(...actions)
}

/**
 * Return an OpenAPI Schema tag for given controller class.
 */
function getControllerTag(controller: Function): string {
  return _.startCase(controller.name.replace(/Controller$/, ''))
}

/**
 * Merge operation items with special handling for the parameters array.
 */
export function mergeOperationItems(
  items: Array<Partial<oa.OperationObject>>
): Partial<oa.OperationObject> {
  // @ts-ignore: array spread
  return _.mergeWith(...items, (to, from, key) => {
    if (key === 'parameters') {
      return _.reduce(
        from,
        (acc, obj) => {
          const index = _.findIndex(acc, { in: obj.in, name: obj.name })
          if (index >= 0) {
            acc[index] = _.merge(acc[index], obj)
            return acc
          }
          return acc.concat(obj)
        },
        to
      )
    }
  })
}
