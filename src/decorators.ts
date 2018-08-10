import * as _ from 'lodash'
import { getFromContainer, MetadataStorage } from 'class-validator'
import { OperationObject } from 'openapi3-ts'
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import 'reflect-metadata'

import { IRoute } from './index'

const OPEN_API_KEY = Symbol('routing-controllers-openapi:OpenAPI')

export type OpenAPIParam =
  | Partial<OperationObject>
  | ((source: OperationObject, route: IRoute) => OperationObject)

/**
 * Supplement action with additional OpenAPI Operation keywords.
 *
 * @param spec OpenAPI Operation object that is merged into the schema derived
 * from routing-controllers decorators. In case of conflicts, keywords defined
 * here overwrite the existing ones. Alternatively you can supply a function
 * that receives as parameters the existing Operation and target route,
 * returning an updated Operation.
 */
export function OpenAPI(spec: OpenAPIParam) {
  return (target: object, key: string) => {
    setOpenAPIMetadata(spec, target, key)
  }
}

/**
 * Apply the keywords defined in @OpenAPI decorator to its target route.
 */
export function applyOpenAPIDecorator(
  originalOperation: OperationObject,
  route: IRoute
): OperationObject {
  const { action } = route
  const metadata = getOpenAPIMetadata(action.target.prototype, action.method)
  return _.isFunction(metadata)
    ? metadata(originalOperation, route)
    : _.merge(originalOperation, metadata)
}

/**
 * Get the OpenAPI Operation object stored in given target property's metadata.
 */
function getOpenAPIMetadata(target: object, key: string): OpenAPIParam {
  return Reflect.getMetadata(OPEN_API_KEY, target.constructor, key) || {}
}

/**
 * Store given OpenAPI Operation object into target property's metadata.
 */
function setOpenAPIMetadata(value: OpenAPIParam, target: object, key: string) {
  return Reflect.defineMetadata(OPEN_API_KEY, value, target.constructor, key)
}

/**
 * Supplement action with response body type annotation.
 *
 * @param responseType Class annotated with class-validator annotations
 */
export function ResponseBody(responseClass: any, statusCode: number = 200) {
  const responseSchema = {
    ['' + statusCode]: { 'application/json': { schema: {} } }
  }
  const metadatas = (getFromContainer(MetadataStorage) as any)
    .validationMetadatas
  const schemas = validationMetadatasToSchemas(metadatas)
  if (
    schemas &&
    responseClass &&
    responseClass.name &&
    schemas[responseClass.name]
  ) {
    responseSchema['' + statusCode]['application/json'].schema =
      schemas[responseClass.name]
  }
  return OpenAPI({ responses: responseSchema })
}
