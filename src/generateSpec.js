"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-submodule-imports
const _ = require("lodash");
const pathToRegexp = require("path-to-regexp");
require("reflect-metadata");
const decorators_1 = require("./decorators");
/** Return full Express path of given route. */
function getFullExpressPath(route) {
    const { action, controller, options } = route;
    return ((options.routePrefix || '') +
        (controller.route || '') +
        (action.route || ''));
}
exports.getFullExpressPath = getFullExpressPath;
/**
 * Return full OpenAPI-formatted path of given route.
 */
function getFullPath(route) {
    return expressToOpenAPIPath(getFullExpressPath(route));
}
exports.getFullPath = getFullPath;
/**
 * Return OpenAPI Operation object for given route.
 */
function getOperation(route) {
    const operation = {
        operationId: getOperationId(route),
        parameters: [
            ...getHeaderParams(route),
            ...getPathParams(route),
            ...getQueryParams(route)
        ],
        requestBody: getRequestBody(route) || undefined,
        responses: getResponses(route),
        summary: getSummary(route),
        tags: getTags(route)
    };
    const cleanedOperation = _.omitBy(operation, _.isEmpty);
    return decorators_1.applyOpenAPIDecorator(cleanedOperation, route);
}
exports.getOperation = getOperation;
/**
 * Return OpenAPI Operation ID for given route.
 */
function getOperationId(route) {
    return `${route.action.target.name}.${route.action.method}`;
}
exports.getOperationId = getOperationId;
/**
 * Return OpenAPI Paths Object for given routes
 */
function getPaths(routes) {
    const routePaths = routes.map(route => ({
        [getFullPath(route)]: {
            [route.action.type]: getOperation(route)
        }
    }));
    // @ts-ignore: array spread
    return _.merge(...routePaths);
}
exports.getPaths = getPaths;
/**
 * Return header parameters of given route.
 */
function getHeaderParams(route) {
    const headers = _(route.params)
        .filter({ type: 'header' })
        .map(headerMeta => {
        const schema = getParamSchema(headerMeta);
        return {
            in: 'header',
            name: headerMeta.name || '',
            required: isRequired(headerMeta, route),
            schema
        };
    })
        .value();
    const headersMeta = _.find(route.params, { type: 'headers' });
    if (headersMeta) {
        const schema = getParamSchema(headersMeta);
        headers.push({
            in: 'header',
            name: _.last(_.split(schema.$ref, '/')) || '',
            required: isRequired(headersMeta, route),
            schema
        });
    }
    return headers;
}
exports.getHeaderParams = getHeaderParams;
/**
 * Return path parameters of given route.
 *
 * Path parameters are first parsed from the path string itself, and then
 * supplemented with possible @Param() decorator values.
 */
function getPathParams(route) {
    const path = getFullExpressPath(route);
    const tokens = pathToRegexp.parse(path);
    return tokens
        .filter(_.isObject) // Omit non-parameter plain string tokens
        .map((token) => {
        const name = token.name + '';
        const param = {
            in: 'path',
            name,
            required: !token.optional,
            schema: { type: 'string' }
        };
        if (token.pattern && token.pattern !== '[^\\/]+?') {
            param.schema = { pattern: token.pattern, type: 'string' };
        }
        const meta = _.find(route.params, { name, type: 'param' });
        if (meta) {
            const metaSchema = getParamSchema(meta);
            param.schema =
                'type' in metaSchema ? Object.assign({}, param.schema, metaSchema) : metaSchema;
        }
        return param;
    });
}
exports.getPathParams = getPathParams;
/**
 * Return query parameters of given route.
 */
function getQueryParams(route) {
    const queries = _(route.params)
        .filter({ type: 'query' })
        .map(queryMeta => {
        const schema = getParamSchema(queryMeta);
        return {
            in: 'query',
            name: queryMeta.name || '',
            required: isRequired(queryMeta, route),
            schema
        };
    })
        .value();
    const queriesMeta = _.find(route.params, { type: 'queries' });
    if (queriesMeta) {
        const schema = getParamSchema(queriesMeta);
        queries.push({
            in: 'query',
            name: _.last(_.split(schema.$ref, '/')) || '',
            required: isRequired(queriesMeta, route),
            schema
        });
    }
    return queries;
}
exports.getQueryParams = getQueryParams;
/**
 * Return OpenAPI requestBody of given route, if it has one.
 */
function getRequestBody(route) {
    const meta = _.find(route.params, { type: 'body' });
    if (meta) {
        const schema = getParamSchema(meta);
        return {
            content: { 'application/json': { schema } },
            description: _.last(_.split(schema.$ref, '/')),
            required: isRequired(meta, route)
        };
    }
}
exports.getRequestBody = getRequestBody;
/**
 * Return OpenAPI Responses object of given route.
 */
function getResponses(route) {
    const isJSON = route.controller.type === 'json';
    const defaultContentType = isJSON
        ? 'application/json'
        : 'text/html; charset=utf-8';
    const contentMeta = _.find(route.responseHandlers, { type: 'content-type' });
    const contentType = contentMeta ? contentMeta.value : defaultContentType;
    const successMeta = _.find(route.responseHandlers, { type: 'success-code' });
    const successStatus = successMeta ? successMeta.value + '' : '200';
    return {
        [successStatus]: {
            content: { [contentType]: {} },
            description: 'Successful response'
        }
    };
}
exports.getResponses = getResponses;
/**
 * Return OpenAPI specification for given routes.
 */
function getSpec(routes) {
    return {
        components: { schemas: {} },
        info: { title: '', version: '1.0.0' },
        openapi: '3.0.0',
        paths: getPaths(routes)
    };
}
exports.getSpec = getSpec;
/**
 * Return OpenAPI Operation summary string for given route.
 */
function getSummary(route) {
    return _.capitalize(_.startCase(route.action.method));
}
exports.getSummary = getSummary;
/**
 * Return OpenAPI tags for given route.
 */
function getTags(route) {
    return [_.startCase(route.controller.target.name.replace(/Controller$/, ''))];
}
exports.getTags = getTags;
/**
 * Convert an Express path into an OpenAPI-compatible path.
 */
function expressToOpenAPIPath(expressPath) {
    const tokens = pathToRegexp.parse(expressPath);
    return tokens
        .map(d => (_.isString(d) ? d : `${d.prefix}{${d.name}}`))
        .join('');
}
exports.expressToOpenAPIPath = expressToOpenAPIPath;
/**
 * Return true if given metadata argument is required, checking for global
 * setting if local setting is not defined.
 */
function isRequired(meta, route) {
    const globalRequired = _.get(route.options, 'defaults.paramOptions.required');
    return globalRequired ? meta.required !== false : !!meta.required;
}
/**
 * Parse given parameter's OpenAPI Schema or Reference object using metadata
 * reflection.
 */
function getParamSchema(param) {
    const { index, object, method } = param;
    const type = Reflect.getMetadata('design:paramtypes', object, method)[index];
    if (_.isFunction(type)) {
        if (_.isString(type.prototype) || _.isSymbol(type.prototype)) {
            return { type: 'string' };
        }
        else if (_.isNumber(type.prototype)) {
            return { type: 'number' };
        }
        else if (_.isBoolean(type.prototype)) {
            return { type: 'boolean' };
        }
        if (type.name !== 'Object') {
            return { $ref: '#/components/schemas/' + type.name };
        }
    }
    return {};
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVTcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2VuZXJhdGVTcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXNDO0FBQ3RDLDRCQUEyQjtBQUUzQiwrQ0FBOEM7QUFDOUMsNEJBQXlCO0FBR3pCLDZDQUFvRDtBQUdwRCwrQ0FBK0M7QUFDL0MsU0FBZ0Isa0JBQWtCLENBQUMsS0FBYTtJQUM5QyxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUE7SUFDN0MsT0FBTyxDQUNMLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7UUFDM0IsQ0FBQyxVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUN4QixDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLENBQ3JCLENBQUE7QUFDSCxDQUFDO0FBUEQsZ0RBT0M7QUFFRDs7R0FFRztBQUNILFNBQWdCLFdBQVcsQ0FBQyxLQUFhO0lBQ3ZDLE9BQU8sb0JBQW9CLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtBQUN4RCxDQUFDO0FBRkQsa0NBRUM7QUFFRDs7R0FFRztBQUNILFNBQWdCLFlBQVksQ0FBQyxLQUFhO0lBQ3hDLE1BQU0sU0FBUyxHQUF1QjtRQUNwQyxXQUFXLEVBQUUsY0FBYyxDQUFDLEtBQUssQ0FBQztRQUNsQyxVQUFVLEVBQUU7WUFDVixHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUM7WUFDekIsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDO1lBQ3ZCLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQztTQUN6QjtRQUNELFdBQVcsRUFBRSxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksU0FBUztRQUMvQyxTQUFTLEVBQUUsWUFBWSxDQUFDLEtBQUssQ0FBQztRQUM5QixPQUFPLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQztRQUMxQixJQUFJLEVBQUUsT0FB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