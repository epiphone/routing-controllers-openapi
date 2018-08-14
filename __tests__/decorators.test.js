"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const src_1 = require("../src");
const models_1 = require("./fixtures/models");
describe('decorators', () => {
    let routes;
    beforeEach(() => {
        routing_controllers_1.getMetadataArgsStorage().reset();
        let UsersController = 
        // @ts-ignore: not referenced
        class UsersController {
            listUsers() {
                return;
            }
            getUser(_userId) {
                return;
            }
            multipleOpenAPIsWithObjectParam() {
                return;
            }
            multipleOpenAPIsWithFunctionParam() {
                return;
            }
            multipleOpenAPIsWithMixedParam() {
                return;
            }
            responseSchemaDefaults(_userId) {
                return;
            }
            responseSchemaOptions(_userId) {
                return;
            }
            responseSchemaDecorators(_userId) {
                return;
            }
        };
        tslib_1.__decorate([
            routing_controllers_1.Get('/'),
            src_1.OpenAPI({
                description: 'List all users'
            }),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], UsersController.prototype, "listUsers", null);
        tslib_1.__decorate([
            routing_controllers_1.Get('/:userId'),
            src_1.OpenAPI((source, route) => (Object.assign({}, source, { tags: [...src_1.getTags(route), 'custom-tag'] }))),
            tslib_1.__param(0, routing_controllers_1.Param('userId')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Number]),
            tslib_1.__metadata("design:returntype", void 0)
        ], UsersController.prototype, "getUser", null);
        tslib_1.__decorate([
            routing_controllers_1.Get('/multipleOpenAPIsWithObjectParam'),
            src_1.OpenAPI({
                summary: 'Some summary',
                ['x-custom-key']: 'This will be overwritten'
            }),
            src_1.OpenAPI({
                description: 'Some description',
                ['x-custom-key']: 'Custom value'
            }),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], UsersController.prototype, "multipleOpenAPIsWithObjectParam", null);
        tslib_1.__decorate([
            routing_controllers_1.Get('/multipleOpenAPIsWithFunctionParam'),
            src_1.OpenAPI((source, _route) => (Object.assign({}, source, { summary: 'Some summary', 'x-custom-key': 10 }))),
            src_1.OpenAPI((source, _route) => (Object.assign({}, source, { description: 'Some description', 'x-custom-key': source['x-custom-key'] * 2 }))),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], UsersController.prototype, "multipleOpenAPIsWithFunctionParam", null);
        tslib_1.__decorate([
            routing_controllers_1.Get('/multipleOpenAPIsWithMixedParam'),
            src_1.OpenAPI({
                summary: 'Some summary',
                'x-custom-key': 10
            }),
            src_1.OpenAPI((source, _route) => (Object.assign({}, source, { description: 'Some description', 'x-custom-key': source['x-custom-key'] * 2 }))),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], UsersController.prototype, "multipleOpenAPIsWithMixedParam", null);
        tslib_1.__decorate([
            routing_controllers_1.Get('/responseSchemaDefaults'),
            src_1.ResponseSchema(models_1.ModelDto),
            tslib_1.__param(0, routing_controllers_1.Param('userId')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Number]),
            tslib_1.__metadata("design:returntype", void 0)
        ], UsersController.prototype, "responseSchemaDefaults", null);
        tslib_1.__decorate([
            routing_controllers_1.Get('/responseSchemaOptions'),
            src_1.ResponseSchema(models_1.ModelDto, { statusCode: 400, contentType: 'text/csv' }),
            tslib_1.__param(0, routing_controllers_1.Param('userId')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Number]),
            tslib_1.__metadata("design:returntype", void 0)
        ], UsersController.prototype, "responseSchemaOptions", null);
        tslib_1.__decorate([
            routing_controllers_1.Get('/responseSchemaDecorators'),
            routing_controllers_1.HttpCode(201),
            routing_controllers_1.ContentType("application/pdf"),
            src_1.ResponseSchema(models_1.ModelDto),
            tslib_1.__param(0, routing_controllers_1.Param('userId')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Number]),
            tslib_1.__metadata("design:returntype", void 0)
        ], UsersController.prototype, "responseSchemaDecorators", null);
        UsersController = tslib_1.__decorate([
            routing_controllers_1.JsonController('/users')
            // @ts-ignore: not referenced
        ], UsersController);
        routes = src_1.parseRoutes(routing_controllers_1.getMetadataArgsStorage());
    });
    it('merges keywords defined in @OpenAPI decorator into operation', () => {
        const operation = src_1.getOperation(routes[0]);
        expect(operation.description).toEqual('List all users');
    });
    it('applies @OpenAPI decorator function parameter to operation', () => {
        const operation = src_1.getOperation(routes[1]);
        expect(operation.tags).toEqual(['Users', 'custom-tag']);
    });
    it('merges consecutive @OpenAPI object parameters top-down', () => {
        const operation = src_1.getOperation(routes[2]);
        expect(operation.summary).toEqual('Some summary');
        expect(operation.description).toEqual('Some description');
        expect(operation['x-custom-key']).toEqual('Custom value');
    });
    it('applies consecutive @OpenAPI function parameters top-down', () => {
        const operation = src_1.getOperation(routes[3]);
        expect(operation.summary).toEqual('Some summary');
        expect(operation.description).toEqual('Some description');
        expect(operation['x-custom-key']).toEqual(20);
    });
    it('merges and applies consecutive @OpenAPI object and function parameters top-down', () => {
        const operation = src_1.getOperation(routes[4]);
        expect(operation.summary).toEqual('Some summary');
        expect(operation.description).toEqual('Some description');
        expect(operation['x-custom-key']).toEqual(20);
    });
    it('applies @ResponseSchema using default contentType and statusCode', () => {
        const operation = src_1.getOperation(routes[5]);
        expect(operation.responses['200'].content['application/json']).toEqual({ "schema": { "$ref": "#/components/schemas/ModelDto" } });
    });
    it('applies @ResponseSchema using contentType and statusCode from options object', () => {
        const operation = src_1.getOperation(routes[6]);
        expect(operation.responses['400'].content['text/csv']).toEqual({ "schema": { "$ref": "#/components/schemas/ModelDto" } });
    });
    it('applies @ResponseSchema using contentType and statusCode from decorators', () => {
        const operation = src_1.getOperation(routes[7]);
        expect(operation.responses['201'].content['application/pdf']).toEqual({ "schema": { "$ref": "#/components/schemas/ModelDto" } });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVjb3JhdG9ycy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZEQU80QjtBQUM1QixnQ0FBNEY7QUFDNUYsOENBQTRDO0FBRTVDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQzFCLElBQUksTUFBZ0IsQ0FBQTtJQUVwQixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsNENBQXNCLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUloQyxJQUFNLGVBQWU7UUFEckIsNkJBQTZCO1FBQzdCLE1BQU0sZUFBZTtZQUtuQixTQUFTO2dCQUNQLE9BQU07WUFDUixDQUFDO1lBT0QsT0FBTyxDQUFrQixPQUFlO2dCQUN0QyxPQUFNO1lBQ1IsQ0FBQztZQVdELCtCQUErQjtnQkFDN0IsT0FBTTtZQUNSLENBQUM7WUFhRCxpQ0FBaUM7Z0JBQy9CLE9BQU07WUFDUixDQUFDO1lBWUQsOEJBQThCO2dCQUM1QixPQUFNO1lBQ1IsQ0FBQztZQUlELHNCQUFzQixDQUFrQixPQUFlO2dCQUNyRCxPQUFNO1lBQ1IsQ0FBQztZQUlELHFCQUFxQixDQUFrQixPQUFlO2dCQUNwRCxPQUFNO1lBQ1IsQ0FBQztZQU1ELHdCQUF3QixDQUFrQixPQUFlO2dCQUN2RCxPQUFNO1lBQ1IsQ0FBQztTQUNGLENBQUE7UUExRUM7WUFKQyx5QkFBRyxDQUFDLEdBQUcsQ0FBQztZQUNSLGFBQU8sQ0FBQztnQkFDUCxXQUFXLEVBQUUsZ0JBQWdCO2FBQzlCLENBQUM7Ozs7d0RBR0Q7UUFPRDtZQUxDLHlCQUFHLENBQUMsVUFBVSxDQUFDO1lBQ2YsYUFBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsbUJBQ3ZCLE1BQU0sSUFDVCxJQUFJLEVBQUUsQ0FBQyxHQUFHLGFBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxZQUFZLENBQUMsSUFDdkMsQ0FBQztZQUNN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