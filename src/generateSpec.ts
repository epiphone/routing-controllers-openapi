// tslint:disable:no-submodule-imports
import _merge from 'lodash.merge'
import _capitalize from 'lodash.capitalize'
import _startCase from 'lodash.startcase'
import * as oa from 'openapi3-ts'
import * as pathToRegexp from 'path-to-regexp'
import 'reflect-metadata'
import { ParamMetadataArgs } from 'routing-controllers/types/metadata/args/ParamMetadataArgs'

import { applyOpenAPIDecorator } from './decorators'
import { IRoute } from './index'

/** Return full Express path of given route. */
export function getFullExpressPath(route: IRoute): string {
  const { action, controller, options } = route
  return (
    (options.routePrefix || '') +
    (controller.route || '') +
    (action.route || '')
  )
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
export function getOperation(
  route: IRoute,
  schemas: { [p: string]: oa.SchemaObject }
): oa.OperationObject {
  const operation: oa.OperationObject = {
    operationId: getOperationId(route),
    parameters: [
      ...getHeaderParams(route),
      ...getPathParams(route),
      ...getQueryParams(route, schemas),
    ],
    requestBody: getRequestBody(route) || undefined,
    responses: getResponses(route),
    summary: getSummary(route),
    tags: getTags(route),
  }

  const cleanedOperation = Object.entries(operation)
    .filter(
      ([_, value]) => value && (value.length || Object.keys(value).length)
    )
    .reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {} as unknown as oa.OperationObject)

  return applyOpenAPIDecorator(cleanedOperation, route)
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
export function getPaths(
  routes: IRoute[],
  schemas: { [p: string]: oa.SchemaObject }
): oa.PathObject {
  const routePaths = routes.map((route) => ({
    [getFullPath(route)]: {
      [route.action.type]: getOperation(route, schemas),
    },
  }))

  // @ts-ignore: array spread
  return _merge(...routePaths)
}

/**
 * Return header parameters of given route.
 */
export function getHeaderParams(route: IRoute): oa.ParameterObject[] {
  const headers: oa.ParameterObject[] = route.params
    .filter((p) => p.type === 'header')
    .map((headerMeta) => {
      const schema = getParamSchema(headerMeta) as oa.SchemaObject
      return {
        in: 'header' as oa.ParameterLocation,
        name: headerMeta.name || '',
        required: isRequired(headerMeta, route),
        schema,
      }
    })

  const headersMeta = route.params.find((p) => p.type === 'headers')
  if (headersMeta) {
    const schema = getParamSchema(headersMeta) as oa.ReferenceObject
    headers.push({
      in: 'header',
      name: schema.$ref.split('/').pop() || '',
      required: isRequired(headersMeta, route),
      schema,
    })
  }

  return headers
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
    .filter((token) => token && typeof token === 'object') // Omit non-parameter plain string tokens
    .map((token: pathToRegexp.Key) => {
      const name = token.name + ''
      const param: oa.ParameterObject = {
        in: 'path',
        name,
        required: token.modifier !== '?',
        schema: { type: 'string' },
      }

      if (token.pattern && token.pattern !== '[^\\/]+?') {
        param.schema = { pattern: token.pattern, type: 'string' }
      }

      const meta = route.params.find(
        (p) => p.name === name && p.type === 'param'
      )
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
export function getQueryParams(
  route: IRoute,
  schemas: { [p: string]: oa.SchemaObject }
): oa.ParameterObject[] {
  const queries: oa.ParameterObject[] = route.params
    .filter((p) => p.type === 'query')
    .map((queryMeta) => {
      const schema = getParamSchema(queryMeta) as oa.SchemaObject
      return {
        in: 'query' as oa.ParameterLocation,
        name: queryMeta.name || '',
        required: isRequired(queryMeta, route),
        schema,
      }
    })

  const queriesMeta = route.params.find((p) => p.type === 'queries')
  if (queriesMeta) {
    const paramSchema = getParamSchema(queriesMeta) as oa.ReferenceObject
    // the last segment after '/'
    const paramSchemaName = paramSchema.$ref.split('/').pop() || ''
    const currentSchema = schemas[paramSchemaName]

    for (const [name, schema] of Object.entries(
      currentSchema?.properties || {}
    )) {
      queries.push({
        in: 'query',
        name,
        required: currentSchema.required?.includes(name),
        schema,
      })
    }
  }
  return queries
}

function getNamedParamSchema(
  param: ParamMetadataArgs
): oa.SchemaObject | oa.ReferenceObject {
  const { type } = param
  if (type === 'file') {
    return { type: 'string', format: 'binary' }
  }
  if (type === 'files') {
    return {
      type: 'array',
      items: {
        type: 'string',
        format: 'binary',
      },
    }
  }
  return getParamSchema(param)
}

/**
 * Return OpenAPI requestBody of given route, if it has one.
 */
export function getRequestBody(route: IRoute): oa.RequestBodyObject | void {
  const bodyParamMetas = route.params.filter((d) => d.type === 'body-param')
  const uploadFileMetas = route.params.filter((d) =>
    ['file', 'files'].includes(d.type)
  )
  const namedParamMetas = [...bodyParamMetas, ...uploadFileMetas]

  const namedParamsSchema: oa.SchemaObject | null =
    namedParamMetas.length > 0
      ? namedParamMetas.reduce(
          (acc: oa.SchemaObject, d) => ({
            ...acc,
            properties: {
              ...acc.properties,
              [d.name!]: getNamedParamSchema(d),
            },
            required: isRequired(d, route)
              ? [...(acc.required || []), d.name!]
              : acc.required,
          }),
          { properties: {}, required: [], type: 'object' }
        )
      : null

  const contentType =
    uploadFileMetas.length > 0 ? 'multipart/form-data' : 'application/json'

  const bodyMeta = route.params.find((d) => d.type === 'body')
  if (bodyMeta) {
    const bodySchema = getParamSchema(bodyMeta)
    const { $ref } =
      'items' in bodySchema && bodySchema.items ? bodySchema.items : bodySchema

    return {
      content: {
        [contentType]: {
          schema: namedParamsSchema
            ? { allOf: [bodySchema, namedParamsSchema] }
            : bodySchema,
        },
      },
      description: ($ref || '').split('/').pop(),
      required: isRequired(bodyMeta, route),
    }
  } else if (namedParamsSchema) {
    return {
      content: { [contentType]: { schema: namedParamsSchema } },
    }
  }
}

/**
 * Return the content type of given route.
 */
export function getContentType(route: IRoute): string {
  const defaultContentType =
    route.controller.type === 'json'
      ? 'application/json'
      : 'text/html; charset=utf-8'
  const contentMeta = route.responseHandlers.find(
    (h) => h.type === 'content-type'
  )
  return contentMeta ? contentMeta.value : defaultContentType
}

/**
 * Return the status code of given route.
 */
export function getStatusCode(route: IRoute): string {
  const successMeta = route.responseHandlers.find(
    (h) => h.type === 'success-code'
  )
  return successMeta ? successMeta.value + '' : '200'
}

/**
 * Return OpenAPI Responses object of given route.
 */
export function getResponses(route: IRoute): oa.ResponsesObject {
  const contentType = getContentType(route)
  const successStatus = getStatusCode(route)

  return {
    [successStatus]: {
      content: { [contentType]: {} },
      description: 'Successful response',
    },
  }
}

/**
 * Return OpenAPI specification for given routes.
 */
export function getSpec(
  routes: IRoute[],
  schemas: { [p: string]: oa.SchemaObject }
): oa.OpenAPIObject {
  return {
    components: { schemas: {} },
    info: { title: '', version: '1.0.0' },
    openapi: '3.0.0',
    paths: getPaths(routes, schemas),
  }
}

/**
 * Return OpenAPI Operation summary string for given route.
 */
export function getSummary(route: IRoute): string {
  return _capitalize(_startCase(route.action.method))
}

/**
 * Return OpenAPI tags for given route.
 */
export function getTags(route: IRoute): string[] {
  return [_startCase(route.controller.target.name.replace(/Controller$/, ''))]
}

/**
 * Convert an Express path into an OpenAPI-compatible path.
 */
export function expressToOpenAPIPath(expressPath: string) {
  const tokens = pathToRegexp.parse(expressPath)
  return tokens
    .map((d) => (typeof d === 'string' ? d : `${d.prefix}{${d.name}}`))
    .join('')
}

/**
 * Return true if given metadata argument is required, checking for global
 * setting if local setting is not defined.
 */
function isRequired(meta: { required?: boolean }, route: IRoute) {
  const globalRequired = route.options?.defaults?.paramOptions?.required
  return globalRequired ? meta.required !== false : !!meta.required
}

/**
 * Parse given parameter's OpenAPI Schema or Reference object using metadata
 * reflection.
 */
function getParamSchema(
  param: ParamMetadataArgs
): oa.SchemaObject | oa.ReferenceObject {
  const { explicitType, index, object, method } = param

  const type: (() => unknown) | unknown = Reflect.getMetadata(
    'design:paramtypes',
    object,
    method
  )[index]
  if (typeof type === 'function' && type.name === 'Array') {
    const items = explicitType
      ? { $ref: '#/components/schemas/' + explicitType.name }
      : { type: 'object' as const }
    return { items, type: 'array' }
  }
  if (explicitType) {
    return { $ref: '#/components/schemas/' + explicitType.name }
  }
  if (typeof type === 'function') {
    if (
      type.prototype === String.prototype ||
      type.prototype === Symbol.prototype
    ) {
      return { type: 'string' }
    } else if (type.prototype === Number.prototype) {
      return { type: 'number' }
    } else if (type.prototype === Boolean.prototype) {
      return { type: 'boolean' }
    } else if (type.name !== 'Object') {
      return { $ref: '#/components/schemas/' + type.name }
    }
  }

  return {}
}
