// tslint:disable:no-submodule-imports
import * as _ from 'lodash'
import * as oa from 'openapi3-ts'
import * as pathToRegexp from 'path-to-regexp'
import 'reflect-metadata'
import { ParamMetadataArgs } from 'routing-controllers/metadata/args/ParamMetadataArgs'

import { applyOpenAPIDecorator } from './decorators'
import { IRoute } from './index'

/** Return full Express path of given route. */
export function getFullExpressPath(route: IRoute): string {
  const { action, controller, options } = route
  return (options.routePrefix || '') + controller.route + (action.route || '')
}

/**
 * Return full OpenAPI-formatted path of given route.
 */
export function getFullPath(route: IRoute): string {
  return expressToOpenAPIPath(getFullExpressPath(route))
}

/**
 * Return OpenAPI Operation object for given route.
 */
export function getOperation(route: IRoute): oa.OperationObject {
  const operation: oa.OperationObject = {
    operationId: getOperationId(route),
    parameters: [...getPathParams(route), ...getQueryParams(route)],
    requestBody: getRequestBody(route) || undefined,
    responses: getResponses(route),
    summary: getSummary(route),
    tags: getTags(route)
  }

  const decoratedOperation = applyOpenAPIDecorator(operation, route)

  // clean empty and undefined properties:
  return _.omitBy(decoratedOperation, _.isEmpty) as oa.OperationObject
}

/**
 * Return OpenAPI Operation ID for given route.
 */
export function getOperationId(route: IRoute): string {
  return `${route.action.target.name}.${route.action.method}`
}

/**
 * Return OpenAPI Paths Object for given routes
 */
export function getPaths(routes: IRoute[]): oa.PathObject {
  const routePaths = routes.map(route => ({
    [getFullPath(route)]: {
      [route.action.type]: getOperation(route)
    }
  }))

  // @ts-ignore: array spread
  return _.merge(...routePaths)
}

/**
 * Return path parameters of given route.
 *
 * Path parameters are first parsed from the path string itself, and then
 * supplemented with possible @Param() decorator values.
 */
export function getPathParams(route: IRoute): oa.ParameterObject[] {
  const path = getFullExpressPath(route)
  const tokens = pathToRegexp.parse(path)

  return tokens
    .filter(_.isObject) // Omit non-parameter plain string tokens
    .map((token: pathToRegexp.Key) => {
      const name = token.name + ''
      const param: oa.ParameterObject = {
        in: 'path',
        name,
        required: !token.optional,
        schema: { type: 'string' }
      }

      if (token.pattern && token.pattern !== '[^\\/]+?') {
        param.schema = { pattern: token.pattern, type: 'string' }
      }

      const meta = _.find(route.params, { name, type: 'param' })
      if (meta) {
        const metaSchema = getParamSchema(meta)
        param.schema =
          'type' in metaSchema ? { ...param.schema, ...metaSchema } : metaSchema
      }

      return param
    })
}

/**
 * Return query parameters of given route.
 */
export function getQueryParams(route: IRoute): oa.ParameterObject[] {
  const queries: oa.ParameterObject[] = _(route.params)
    .filter({ type: 'query' })
    .map(queryMeta => {
      const schema = getParamSchema(queryMeta) as oa.SchemaObject
      return {
        in: 'query',
        name: queryMeta.name || '',
        required: isRequired(queryMeta, route),
        schema
      }
    })
    .value()

  const queriesMeta = _.find(route.params, { type: 'queries' })
  if (queriesMeta) {
    const schema = getParamSchema(queriesMeta) as oa.ReferenceObject
    queries.push({
      in: 'query',
      name: _.last(_.split(schema.$ref, '/')) || '',
      required: isRequired(queriesMeta, route),
      schema
    })
  }

  return queries
}

/**
 * Return OpenAPI requestBody of given route, if it has one.
 */
export function getRequestBody(route: IRoute): oa.RequestBodyObject | void {
  const meta = _.find(route.params, { type: 'body' })
  if (meta) {
    const schema = getParamSchema(meta) as oa.ReferenceObject
    return {
      content: { 'application/json': { schema } },
      description: _.last(_.split(schema.$ref, '/')),
      required: isRequired(meta, route)
    }
  }
}

/**
 * Return OpenAPI Responses object of given route.
 */
export function getResponses(route: IRoute): oa.ResponsesObject {
  const isJSON = route.controller.type === 'json'
  const defaultContentType = isJSON
    ? 'application/json'
    : 'text/html; charset=utf-8'
  const contentMeta = _.find(route.responseHandlers, { type: 'content-type' })
  const contentType = contentMeta ? contentMeta.value : defaultContentType

  const successMeta = _.find(route.responseHandlers, { type: 'success-code' })
  const successStatus = successMeta ? successMeta.value + '' : '200'
  return {
    [successStatus]: {
      content: { [contentType]: {} },
      description: 'Successful response'
    }
  }
}

/**
 * Return OpenAPI specification for given routes.
 */
export function getSpec(routes: IRoute[]): oa.OpenAPIObject {
  return {
    components: { schemas: {} },
    info: { title: '', version: '1.0.0' },
    openapi: '3.0.0',
    paths: getPaths(routes)
  }
}

/**
 * Return OpenAPI Operation summary string for given route.
 */
export function getSummary(route: IRoute): string {
  return _.capitalize(_.startCase(route.action.method))
}

/**
 * Return OpenAPI tags for given route.
 */
export function getTags(route: IRoute): string[] {
  return [_.startCase(route.controller.target.name.replace(/Controller$/, ''))]
}

/**
 * Convert an Express path into an OpenAPI-compatible path.
 */
export function expressToOpenAPIPath(expressPath: string) {
  const tokens = pathToRegexp.parse(expressPath)
  return tokens
    .map(d => (_.isString(d) ? d : `${d.prefix}{${d.name}}`))
    .join('')
}

/**
 * Return true if given metadata argument is required, checking for global
 * setting if local setting is not defined.
 */
function isRequired(meta: { required?: boolean }, route: IRoute) {
  const globalRequired = _.get(route.options, 'defaults.paramOptions.required')
  return globalRequired ? meta.required !== false : !!meta.required
}

/**
 * Parse given parameter's OpenAPI Schema or Reference object using metadata
 * reflection.
 */
function getParamSchema(
  param: ParamMetadataArgs
): oa.SchemaObject | oa.ReferenceObject {
  const { index, object, method } = param

  const type = Reflect.getMetadata('design:paramtypes', object, method)[index]
  if (_.isFunction(type)) {
    if (_.isString(type.prototype) || _.isSymbol(type.prototype)) {
      return { type: 'string' }
    } else if (_.isNumber(type.prototype)) {
      return { type: 'number' }
    } else if (_.isBoolean(type.prototype)) {
      return { type: 'boolean' }
    }
    if (type.name !== 'Object') {
      return { $ref: '#/components/schemas/' + type.name }
    }
  }
  return {}
}
