import _merge from 'lodash.merge'
import * as oa from 'openapi3-ts'
import {
  MetadataArgsStorage,
  RoutingControllersOptions,
} from 'routing-controllers'

import { getSpec } from './generateSpec'
import { parseRoutes } from './parseMetadata'

export * from './decorators'
export * from './generateSpec'
export * from './parseMetadata'

/**
 * Convert routing-controllers metadata into an OpenAPI specification.
 *
 * @param storage routing-controllers metadata storage
 * @param routingControllerOptions routing-controllers options
 * @param additionalProperties Additional OpenAPI Spec properties
 */
export function routingControllersToSpec(
  storage: MetadataArgsStorage,
  routingControllerOptions: RoutingControllersOptions = {},
  additionalProperties: Partial<oa.OpenAPIObject> = {}
): oa.OpenAPIObject {
  const routes = parseRoutes(storage, routingControllerOptions)
  const spec = getSpec(routes, additionalProperties.components?.schemas || {})

  return _merge(spec, additionalProperties)
}
