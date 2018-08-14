"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
require("reflect-metadata");
const OPEN_API_KEY = Symbol('routing-controllers-openapi:OpenAPI');
/**
 * Supplement action with additional OpenAPI Operation keywords.
 *
 * @param spec OpenAPI Operation object that is merged into the schema derived
 * from routing-controllers decorators. In case of conflicts, keywords defined
 * here overwrite the existing ones. Alternatively you can supply a function
 * that receives as parameters the existing Operation and target route,
 * returning an updated Operation.
 */
function OpenAPI(spec) {
    return (target, key) => {
        const currentMeta = getOpenAPIMetadata(target, key);
        setOpenAPIMetadata([spec, ...currentMeta], target, key);
    };
}
exports.OpenAPI = OpenAPI;
/**
 * Apply the keywords defined in @OpenAPI decorator to its target route.
 */
function applyOpenAPIDecorator(originalOperation, route) {
    const { action } = route;
    const openAPIParams = getOpenAPIMetadata(action.target.prototype, action.method);
    return openAPIParams.reduce((acc, oaParam) => {
        return _.isFunction(oaParam)
            ? oaParam(acc, route)
            : _.merge({}, acc, oaParam);
    }, originalOperation);
}
exports.applyOpenAPIDecorator = applyOpenAPIDecorator;
/**
 * Get the OpenAPI Operation object stored in given target property's metadata.
 */
function getOpenAPIMetadata(target, key) {
    return Reflect.getMetadata(OPEN_API_KEY, target.constructor, key) || [];
}
/**
 * Store given OpenAPI Operation object into target property's metadata.
 */
function setOpenAPIMetadata(value, target, key) {
    return Reflect.defineMetadata(OPEN_API_KEY, value, target.constructor, key);
}
/**
 * Supplement action with response body type annotation.
 *
 */
function ResponseSchema(responseClass, options) {
    // @ts-ignore
    const setResponseSchema = (source, route) => {
        options = Object.assign({
            statusCode: _.find(route.responseHandlers, { type: 'success-code' })
                ? _.find(route.responseHandlers, { type: 'success-code' }).value
                : 200,
            contentType: _.find(route.responseHandlers, { type: 'content-type' })
                ? _.find(route.responseHandlers, { type: 'content-type' }).value
                : 'application/json',
            isArray: false,
        }, (options || {}));
        const responseSchema = {
            ['' + options.statusCode]: { content: { [options.contentType]: { schema: {} } } },
        };
        if (responseClass && responseClass.name) {
            if (options.isArray) {
                responseSchema['' + options.statusCode].content[options.contentType].schema = {
                    type: 'array',
                    items: {
                        ['$ref']: `#/components/schemas/${responseClass.name}`,
                    },
                };
            }
            else {
                responseSchema['' + options.statusCode].content[options.contentType].schema['$ref'] = `#/components/schemas/${responseClass.name}`;
            }
        }
        return { responses: responseSchema };
    };
    return OpenAPI(setResponseSchema);
}
exports.ResponseSchema = ResponseSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlY29yYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBMkI7QUFFM0IsNEJBQXlCO0FBSXpCLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFBO0FBTWxFOzs7Ozs7OztHQVFHO0FBQ0gsU0FBZ0IsT0FBTyxDQUFDLElBQWtCO0lBQ3hDLE9BQU8sQ0FBQyxNQUFjLEVBQUUsR0FBVyxFQUFFLEVBQUU7UUFDckMsTUFBTSxXQUFXLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQ25ELGtCQUFrQixDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsV0FBVyxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBQ3pELENBQUMsQ0FBQTtBQUNILENBQUM7QUFMRCwwQkFLQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IscUJBQXFCLENBQ25DLGlCQUFrQyxFQUNsQyxLQUFhO0lBRWIsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQTtJQUN4QixNQUFNLGFBQWEsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDaEYsT0FBTyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBb0IsRUFBRSxPQUFxQixFQUFFLEVBQUU7UUFDMUUsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztZQUMxQixDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUMvQixDQUFDLEVBQUUsaUJBQWlCLENBQW9CLENBQUE7QUFDMUMsQ0FBQztBQVhELHNEQVdDO0FBRUQ7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