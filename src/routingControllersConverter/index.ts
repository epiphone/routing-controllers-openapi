// tslint:disable:no-submodule-imports
import {
  getMetadataArgsStorage,
  MetadataArgsStorage,
  RoutingControllersOptions
} from 'routing-controllers'
import * as _ from 'lodash'
import * as oa from 'openapi3-ts'
import { ActionMetadataArgs } from 'routing-controllers/metadata/args/ActionMetadataArgs'

// const bodyParam = _.find(getMetadataArgsStorage().params, { type: 'body' })
// const bodyClass = Reflect.getMetadata('design:paramtypes', bodyParam.object, bodyParam.method)[bodyParam.index]

export function routingControllersToSpec(
  storage?: MetadataArgsStorage,
  options: RoutingControllersOptions = {},
  info: oa.InfoObject = { title: '', version: '1.0.0' }
): oa.OpenAPIObject {
  storage = storage || getMetadataArgsStorage()
  // TODO routeprefix, defaults.required
  // console.log('storage', storage)
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
    responses: { 200: { content: {} } },
    summary: _.capitalize(_.startCase(action.method))
  }

  const params = storage.filterParamsWithTargetAndMethod(
    action.target,
    action.method
  )
  const responseHandlers = storage.filterResponseHandlersWithTargetAndMethod(
    action.target,
    action.method
  )

  // TODO implement...

  return defaultOperation
}
