"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = require("lodash");
const routing_controllers_1 = require("routing-controllers");
const src_1 = require("../src");
describe('parameters', () => {
    let route;
    beforeAll(() => {
        class ListUsersHeaderParams {
        }
        class ListUsersQueryParams {
        }
        let UsersController = 
        // @ts-ignore: not referenced
        class UsersController {
            getPost(_numberParam, _invalidParam, _booleanParam, _anyParam, _limit, _authorization, _queryRef, _headerParams) {
                return;
            }
        };
        tslib_1.__decorate([
            routing_controllers_1.Get('/:string/:regex(\\d{6})/:optional?/:number/:boolean/:any'),
            tslib_1.__param(0, routing_controllers_1.Param('number')),
            tslib_1.__param(1, routing_controllers_1.Param('invalid')),
            tslib_1.__param(2, routing_controllers_1.Param('boolean')),
            tslib_1.__param(3, routing_controllers_1.Param('any')),
            tslib_1.__param(4, routing_controllers_1.QueryParam('limit')),
            tslib_1.__param(5, routing_controllers_1.HeaderParam('Authorization', { required: true })),
            tslib_1.__param(6, routing_controllers_1.QueryParams()),
            tslib_1.__param(7, routing_controllers_1.HeaderParams()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Number, String, Boolean, Object, Number, String, ListUsersQueryParams,
                ListUsersHeaderParams]),
            tslib_1.__metadata("design:returntype", void 0)
        ], UsersController.prototype, "getPost", null);
        UsersController = tslib_1.__decorate([
            routing_controllers_1.JsonController('/users')
            // @ts-ignore: not referenced
        ], UsersController);
        route = src_1.parseRoutes(routing_controllers_1.getMetadataArgsStorage())[0];
    });
    it('parses path parameter from path strings', () => {
        expect(src_1.getPathParams(Object.assign({}, route, { params: [] }))).toEqual([
            {
                in: 'path',
                name: 'string',
                required: true,
                schema: { type: 'string' }
            },
            {
                in: 'path',
                name: 'regex',
                required: true,
                schema: { pattern: '\\d{6}', type: 'string' }
            },
            {
                in: 'path',
                name: 'optional',
                required: false,
                schema: { type: 'string' }
            },
            {
                in: 'path',
                name: 'number',
                required: true,
                schema: { type: 'string' }
            },
            {
                in: 'path',
                name: 'boolean',
                required: true,
                schema: { type: 'string' }
            },
            {
                in: 'path',
                name: 'any',
                required: true,
                schema: { type: 'string' }
            }
        ]);
    });
    it('supplements path parameter with @Param decorator', () => {
        expect(src_1.getPathParams(route)).toEqual([
            {
                in: 'path',
                name: 'string',
                required: true,
                schema: { type: 'string' }
            },
            {
                in: 'path',
                name: 'regex',
                required: true,
                schema: { pattern: '\\d{6}', type: 'string' }
            },
            {
                in: 'path',
                name: 'optional',
                required: false,
                schema: { type: 'string' }
            },
            {
                in: 'path',
                name: 'number',
                required: true,
                schema: { type: 'number' }
            },
            {
                in: 'path',
                name: 'boolean',
                required: true,
                schema: { type: 'boolean' }
            },
            {
                in: 'path',
                name: 'any',
                required: true,
                schema: {}
            }
        ]);
    });
    it('ignores @Param if corresponding name is not found in path string', () => {
        expect(_.filter(src_1.getPathParams(route), { name: 'invalid' })).toEqual([]);
    });
    it('parses query param from @QueryParam decorator', () => {
        expect(src_1.getQueryParams(route)[0]).toEqual({
            in: 'query',
            name: 'limit',
            required: false,
            schema: { type: 'number' }
        });
    });
    it('parses query param ref from @QueryParams decorator', () => {
        expect(src_1.getQueryParams(route)[1]).toEqual({
            in: 'query',
            name: 'ListUsersQueryParams',
            required: false,
            schema: { $ref: '#/components/schemas/ListUsersQueryParams' }
        });
    });
    it('parses header param from @HeaderParam decorator', () => {
        expect(src_1.getHeaderParams(route)[0]).toEqual({
            in: 'header',
            name: 'Authorization',
            required: true,
            schema: { type: 'string' }
        });
    });
    it('parses header param ref from @HeaderParams decorator', () => {
        expect(src_1.getHeaderParams(route)[1]).toEqual({
            in: 'header',
            name: 'ListUsersHeaderParams',
            required: false,
            schema: { $ref: '#/components/schemas/ListUsersHeaderParams' }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYW1ldGVycy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFyYW1ldGVycy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRCQUEyQjtBQUMzQiw2REFTNEI7QUFFNUIsZ0NBTWU7QUFFZixRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtJQUMxQixJQUFJLEtBQWEsQ0FBQTtJQUVqQixTQUFTLENBQUMsR0FBRyxFQUFFO1FBQ2IsTUFBTSxxQkFBcUI7U0FBRztRQUM5QixNQUFNLG9CQUFvQjtTQUFHO1FBSTdCLElBQU0sZUFBZTtRQURyQiw2QkFBNkI7UUFDN0IsTUFBTSxlQUFlO1lBRW5CLE9BQU8sQ0FDWSxZQUFvQixFQUNuQixhQUFxQixFQUNyQixhQUFzQixFQUMxQixTQUFjLEVBQ1AsTUFBYyxFQUVuQyxjQUFzQixFQUNQLFNBQWdDLEVBQy9CLGFBQXFDO2dCQUVyRCxPQUFNO1lBQ1IsQ0FBQztTQUNGLENBQUE7UUFiQztZQURDLHlCQUFHLENBQUMsMERBQTBELENBQUM7WUFFN0QsbUJBQUEsMkJBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUNmLG1CQUFBLDJCQUFLLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDaEIsbUJBQUEsMkJBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtZQUNoQixtQkFBQSwyQkFBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ1osbUJBQUEsZ0NBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNuQixtQkFBQSxpQ0FBVyxDQUFDLGVBQWUsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1lBRWhELG1CQUFBLGlDQUFXLEVBQUUsQ0FBQTtZQUNiLG1CQUFBLGtDQUFZLEVBQUUsQ0FBQTs7c0dBRFksb0JBQW9CO2dCQUNmLHFCQUFxQjs7c0RBR3REO1FBZEcsZUFBZTtZQUZwQixvQ0FBYyxDQUFDLFFBQVEsQ0FBQztZQUN6Qiw2QkFBNkI7V0FDdkIsZUFBZSxD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