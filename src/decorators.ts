import * as _ from 'lodash'
import { OperationObject, SchemaObject } from 'openapi3-ts'
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
    const currentMeta = getOpenAPIMetadata(target, key)
    setOpenAPIMetadata([spec, ...currentMeta], target, key)
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
  const openAPIParams = getOpenAPIMetadata(action.target.prototype, action.method)
  return openAPIParams.reduce((acc: OperationObject, oaParam: OpenAPIParam) => {
    return _.isFunction(oaParam)
      ? oaParam(acc, route)
      : _.merge({}, acc, oaParam)
  }, originalOperation) as OperationObject
}

/**
 * Get the OpenAPI Operation object stored in given target property's metadata.
 */
function getOpenAPIMetadata(target: object, key: string): OpenAPIParam[] {
  return Reflect.getMetadata(OPEN_API_KEY, target.constructor, key) || []
}

/**
 * Store given OpenAPI Operation object into target property's metadata.
 */
function setOpenAPIMetadata(value: OpenAPIParam[], target: object, key: string) {
  return Reflect.defineMetadata(OPEN_API_KEY, value, target.constructor, key)
}

/**
 * Supplement action with response body type annotation.
 *
 */
export function ResponseSchema(responseClass: Function, options?: {
	statusCode?: number;
	contentType?: string;
	isArray?: boolean;
}) {
	const setResponseSchema = (source: OperationObject, route: IRoute) => {
		options = {
			...{
				statusCode: _.find(route.responseHandlers, { type: 'success-code' })
					? _.find(route.responseHandlers, { type: 'success-code' })!.value
					: 200,
				contentType: _.find(route.responseHandlers, { type: 'content-type' })
					? _.find(route.responseHandlers, { type: 'content-type' })!.value
					: 'application/json',
				isArray: false,
			},
			...(options || {}),
		};
		const responseSchema = {
			['' + options.statusCode]: { content: { [options.contentType!]: { schema: {} as SchemaObject } } },
		};
		if (responseClass && responseClass.name) {
			if (options.isArray) {
				responseSchema['' + options.statusCode].content[options.contentType!].schema = {
					type: 'array',
					items: {
						['$ref']: `#/components/schemas/${responseClass.name}`,
					},
				};
			} else {
				responseSchema['' + options.statusCode].content[options.contentType!].schema['$ref'] = `#/components/schemas/${
					responseClass.name
				}`;
			}
		}
		return _.merge(source, { responses: responseSchema });
	};
	return OpenAPI(setResponseSchema);
}