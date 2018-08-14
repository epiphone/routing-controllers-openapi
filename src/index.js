"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = require("lodash");
const generateSpec_1 = require("./generateSpec");
const parseMetadata_1 = require("./parseMetadata");
tslib_1.__exportStar(require("./decorators"), exports);
tslib_1.__exportStar(require("./generateSpec"), exports);
tslib_1.__exportStar(require("./parseMetadata"), exports);
/**
 * Convert routing-controllers metadata into an OpenAPI specification.
 *
 * @param storage routing-controllers metadata storage
 * @param routingControllerOptions routing-controllers options
 * @param additionalProperties Additional OpenAPI Spec properties
 */
function routingControllersToSpec(storage, routingControllerOptions = {}, additionalProperties = {}) {
    const routes = parseMetadata_1.parseRoutes(storage, routingControllerOptions);
    const spec = generateSpec_1.getSpec(routes);
    return _.merge(spec, additionalProperties);
}
exports.routingControllersToSpec = routingControllersToSpec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0QkFBMkI7QUFPM0IsaURBQXdDO0FBQ3hDLG1EQUE2QztBQUU3Qyx1REFBNEI7QUFDNUIseURBQThCO0FBQzlCLDBEQUErQjtBQUUvQjs7Ozs7O0dBTUc7QUFDSCxTQUFnQix3QkFBd0IsQ0FDdEMsT0FBNEIsRUFDNUIsMkJBQXNELEVBQUUsRUFDeEQsdUJBQWtELEVBQUU7SUFFcEQsTUFBTSxNQUFNLEdBQUcsMkJBQVcsQ0FBQyxPQUFPLEVBQUUsd0JBQXdCLENBQUMsQ0FBQTtJQUM3RCxNQUFNLElBQUksR0FBRyxzQkFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBRTVCLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQTtBQUM1QyxDQUFDO0FBVEQsNERBU0MifQ==