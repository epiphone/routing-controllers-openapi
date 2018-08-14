"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-submodule-imports
const _ = require("lodash");
/**
 * Parse routing-controllers metadata into an IRoute objects array.
 */
function parseRoutes(storage, options = {}) {
    return storage.actions.map(action => ({
        action,
        controller: _.find(storage.controllers, {
            target: action.target
        }),
        options,
        params: _.sortBy(storage.filterParamsWithTargetAndMethod(action.target, action.method), 'index'),
        responseHandlers: storage.filterResponseHandlersWithTargetAndMethod(action.target, action.method)
    }));
}
exports.parseRoutes = parseRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VNZXRhZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBhcnNlTWV0YWRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBc0M7QUFDdEMsNEJBQTJCO0FBcUIzQjs7R0FFRztBQUNILFNBQWdCLFdBQVcsQ0FDekIsT0FBNEIsRUFDNUIsVUFBcUMsRUFBRTtJQUV2QyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwQyxNQUFNO1FBQ04sVUFBVSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUN0QyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07U0FDdEIsQ0FBMkI7UUFDNUIsT0FBTztRQUNQLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUNkLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFDckUsT0FBTyxDQUNSO1FBQ0QsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLHlDQUF5QyxDQUNqRSxNQUFNLENBQUMsTUFBTSxFQUNiLE1BQU0sQ0FBQyxNQUFNLENBQ2Q7S0FDRixDQUFDLENBQUMsQ0FBQTtBQUNMLENBQUM7QUFuQkQsa0NBbUJDIn0=