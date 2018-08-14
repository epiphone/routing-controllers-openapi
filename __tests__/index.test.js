"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-implicit-dependencies
const class_validator_1 = require("class-validator");
const class_validator_jsonschema_1 = require("class-validator-jsonschema");
const _ = require("lodash");
const routing_controllers_1 = require("routing-controllers");
const src_1 = require("../src");
const controllers_1 = require("./fixtures/controllers");
// Construct OpenAPI spec:
const storage = routing_controllers_1.getMetadataArgsStorage();
const options = {
    controllers: [controllers_1.UsersController, controllers_1.UserPostsController],
    routePrefix: '/api'
};
const routes = src_1.parseRoutes(storage, options);
describe('index', () => {
    it('generates an OpenAPI spec from routing-controllers metadata', () => {
        // Include component schemas parsed with class-validator-jsonschema:
        const metadatas = class_validator_1.getFromContainer(class_validator_1.MetadataStorage)
            .validationMetadatas;
        const schemas = class_validator_jsonschema_1.validationMetadatasToSchemas(metadatas, {
            refPointerPrefix: '#/components/schemas'
        });
        const spec = src_1.routingControllersToSpec(storage, options, {
            components: { schemas },
            info: { title: 'My app', version: '1.2.0' }
        });
        expect(spec).toEqual(require('./fixtures/spec.json'));
    });
    it('parses actions in declared order from controller metadata', () => {
        const actions = routes.map(d => d.action);
        expect(actions).toEqual([
            {
                method: 'listUsers',
                route: '/',
                target: controllers_1.UsersController,
                type: 'get'
            },
            {
                method: 'listUsersInRange',
                route: '/:from-:to',
                target: controllers_1.UsersController,
                type: 'get'
            },
            {
                method: 'getUser',
                route: '/:userId?',
                target: controllers_1.UsersController,
                type: 'get'
            },
            {
                method: 'createUser',
                route: '/',
                target: controllers_1.UsersController,
                type: 'post'
            },
            {
                method: 'createUserPost',
                route: '/:userId/posts',
                target: controllers_1.UsersController,
                type: 'post'
            },
            {
                method: 'deleteUsersByVersion',
                route: '/:version(v?\\d{1}|all)',
                target: controllers_1.UsersController,
                type: 'delete'
            },
            {
                method: 'putUserDefault',
                route: undefined,
                target: controllers_1.UsersController,
                type: 'put'
            },
            {
                method: 'getUserPost',
                route: '/:postId',
                target: controllers_1.UserPostsController,
                type: 'get'
            },
            {
                method: 'getDefaultPath',
                route: undefined,
                target: controllers_1.RootController,
                type: 'get'
            },
            {
                method: 'getStringPath',
                route: '/stringPath',
                target: controllers_1.RootController,
                type: 'get'
            }
        ]);
    });
    it('gets full OpenAPI-formatted paths', () => {
        const route = _.cloneDeep(routes[0]);
        expect(src_1.getFullPath(route)).toEqual('/api/users/');
        route.options.routePrefix = undefined;
        expect(src_1.getFullPath(route)).toEqual('/users/');
        route.controller.route = '';
        expect(src_1.getFullPath(route)).toEqual('/');
        route.action.route = '/all';
        expect(src_1.getFullPath(route)).toEqual('/all');
    });
    it('converts Express paths into OpenAPI paths', () => {
        expect(src_1.expressToOpenAPIPath('')).toEqual('');
        expect(src_1.expressToOpenAPIPath('/')).toEqual('/');
        expect(src_1.expressToOpenAPIPath('123')).toEqual('123');
        expect(src_1.expressToOpenAPIPath('/users')).toEqual('/users');
        expect(src_1.expressToOpenAPIPath('/users/:userId')).toEqual('/users/{userId}');
        expect(src_1.expressToOpenAPIPath('/users/:userId/:from-:to')).toEqual('/users/{userId}/{from}-{to}');
        expect(src_1.expressToOpenAPIPath('/users/:userId/:limit?')).toEqual('/users/{userId}/{limit}');
        expect(src_1.expressToOpenAPIPath('/users/:userId(\\d+)')).toEqual('/users/{userId}');
        expect(src_1.expressToOpenAPIPath('/users/:type(user|admin)')).toEqual('/users/{type}');
    });
    it('gets OpenAPI Operation IDs', () => {
        const route = _.cloneDeep(routes[0]);
        expect(src_1.getOperationId(route)).toEqual('UsersController.listUsers');
        route.action.target = class AnotherController {
        };
        route.action.method = 'anotherMethod';
        expect(src_1.getOperationId(route)).toEqual('AnotherController.anotherMethod');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQ0FBMEM7QUFDMUMscURBQW1FO0FBQ25FLDJFQUF5RTtBQUN6RSw0QkFBMkI7QUFDM0IsNkRBQTREO0FBRTVELGdDQU1lO0FBQ2Ysd0RBSStCO0FBRS9CLDBCQUEwQjtBQUMxQixNQUFNLE9BQU8sR0FBRyw0Q0FBc0IsRUFBRSxDQUFBO0FBQ3hDLE1BQU0sT0FBTyxHQUFHO0lBQ2QsV0FBVyxFQUFFLENBQUMsNkJBQWUsRUFBRSxpQ0FBbUIsQ0FBQztJQUNuRCxXQUFXLEVBQUUsTUFBTTtDQUNwQixDQUFBO0FBQ0QsTUFBTSxNQUFNLEdBQUcsaUJBQVcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFFNUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDckIsRUFBRSxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtRQUNyRSxvRUFBb0U7UUFDcEUsTUFBTSxTQUFTLEdBQUksa0NBQWdCLENBQUMsaUNBQWUsQ0FBUzthQUN6RCxtQkFBbUIsQ0FBQTtRQUN0QixNQUFNLE9BQU8sR0FBRyx5REFBNEIsQ0FBQyxTQUFTLEVBQUU7WUFDdEQsZ0JBQWdCLEVBQUUsc0JBQXNCO1NBQ3pDLENBQUMsQ0FBQTtRQUVGLE1BQU0sSUFBSSxHQUFHLDhCQUF3QixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUU7WUFDdEQsVUFBVSxFQUFFLEVBQUUsT0FBTyxFQUFFO1lBQ3ZCLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtTQUM1QyxDQUFDLENBQUE7UUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUE7SUFDdkQsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsMkRBQTJELEVBQUUsR0FBRyxFQUFFO1FBQ25FLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDekMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUN0QjtnQkFDRSxNQUFNLEVBQUUsV0FBVztnQkFDbkIsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsTUFBTSxFQUFFLDZCQUFlO2dCQUN2QixJQUFJLEVBQUUsS0FBSzthQUNaO1lBQ0Q7Z0JBQ0UsTUFBTSxFQUFFLGtCQUFrQjtnQkFDMUIsS0FBSyxFQUFFLFlBQVk7Z0JBQ25CLE1BQU0sRUFBRSw2QkFBZTtnQkFDdkIsSUFBSSxFQUFFLEtBQUs7YUFDWjtZQUNEO2dCQUNFLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixLQUFLLEVBQUUsV0FBVztnQkFDbEIsTUFBTSxFQUFFLDZCQUFlO2dCQUN2QixJQUFJLEVBQUUsS0FBSzthQUNaO1lBQ0Q7Z0JBQ0UsTUFBTSxFQUFFLFlBQVk7Z0JBQ3BCLEtBQUssRUFBRSxHQUFHO2dCQUNWLE1BQU0sRUFBRSw2QkFBZTtnQkFDdkIsSUFBSSxFQUFFLE1BQU07YUFDYjtZQUNEO2dCQUNFLE1BQU0sRUFBRSxnQkFBZ0I7Z0JBQ3hCLEtBQUssRUFBRSxnQkFBZ0I7Z0JBQ3ZCLE1BQU0sRUFBRSw2QkFBZTtnQkFDdkIsSUFBSSxFQUFFLE1BQU07YUFDYjtZQUNEO2dCQUNFLE1BQU0sRUFBRSxzQkFBc0I7Z0JBQzlCLEtBQUssRUFBRSx5QkFBeUI7Z0JBQ2hDLE1BQU0sRUFBRSw2QkFBZTtnQkFDdkIsSUFBSSxFQUFFLFFBQVE7YUFDZjtZQUNEO2dCQUNFLE1BQU0sRUFBRSxnQkFBZ0I7Z0JBQ3hCLEtBQUssRUFBRSxTQUFTO2dCQUNoQixNQUFNLEVBQUUsNkJBQWU7Z0JBQ3ZCLElBQUksRUFBRSxLQUFLO2FBQ1o7WUFDRDtnQkFDRSxNQUFNLEVBQUUsYUFBYTtnQkFDckIsS0FBSyxFQUFFLFVBQVU7Z0JBQ2pCLE1BQU0sRUFBRSxpQ0FBbUI7Z0JBQzNCLElBQUksRUFBRSxLQUFLO2FBQ1o7WUFDRDtnQkFDRSxNQUFNLEVBQUUsZ0JBQWdCO2dCQUN4QixLQUFLLEVBQUUsU0FBUztnQkFDaEIsTUFBTSxFQUFFLDRCQUFjO2dCQUN0QixJQUFJLEVBQUUsS0FBSzthQUNaO1lBQ0Q7Z0JBQ0UsTUFBTSxFQUFFLGVBQWU7Z0JBQ3ZCLEtBQUssRUFBRSxhQUFhO2dCQUNwQixNQUFNLEVBQUUsNEJBQWM7Z0JBQ3RCLElBQUksRUFBRSxLQUFLO2FBQ1o7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7UUFDM0MsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNwQyxNQUFNLENBQUMsaUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUVqRCxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUE7UUFDckMsTUFBTSxDQUFDLGlCQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7UUFFN0MsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFBO1FBQzNCLE1BQU0sQ0FBQyxpQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBRXZDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQTtRQUMzQixNQUFNLENBQUMsaUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUM1QyxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7UUFDbkQsTUFBTSxDQUFDLDBCQUFvQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzVDLE1BQU0sQ0FBQywwQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUM5QyxNQUFNLENBQUMsMEJBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDbEQsTUFBTSxDQUFDLDBCQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ3hELE1BQU0sQ0FBQywwQkFBb0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUE7UUFDekUsTUFBTSxDQUFDLDBCQUFvQixDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQzlELDZCQUE2QixDQUM5QixDQUFBO1FBQ0QsTUFBTSxDQUFDLDBCQUFvQixDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQzVELHlCQUF5QixDQUMxQixDQUFBO1FBQ0QsTUFBTSxDQUFDLDBCQUFvQixDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQzFELGlCQUFpQixDQUNsQixDQUFBO1FBQ0QsTUFBTSxDQUFDLDBCQUFvQixDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQzlELGVBQWUsQ0FDaEIsQ0FBQTtJQUNILENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtRQUNwQyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3BDLE1BQU0sQ0FBQyxvQkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUE7UUFFbEUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxpQkFBaUI7U0FBRyxDQUFBO1FBQ2hELEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLGVBQWUsQ0FBQTtRQUNyQyxNQUFNLENBQUMsb0JBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFBO0lBQzFFLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEifQ==