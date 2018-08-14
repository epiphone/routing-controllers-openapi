"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const src_1 = require("../src");
describe('options', () => {
    let route;
    beforeEach(() => {
        routing_controllers_1.getMetadataArgsStorage().reset();
        class CreateUserBody {
        }
        let UsersController = 
        // @ts-ignore: not referenced
        class UsersController {
            createUser(_from, _to, _body) {
                return;
            }
        };
        tslib_1.__decorate([
            routing_controllers_1.Post('/:userId'),
            tslib_1.__param(0, routing_controllers_1.QueryParam('from')),
            tslib_1.__param(1, routing_controllers_1.QueryParam('to', { required: false })),
            tslib_1.__param(2, routing_controllers_1.Body()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Number, Number, CreateUserBody]),
            tslib_1.__metadata("design:returntype", void 0)
        ], UsersController.prototype, "createUser", null);
        UsersController = tslib_1.__decorate([
            routing_controllers_1.JsonController('/users')
            // @ts-ignore: not referenced
        ], UsersController);
        route = src_1.parseRoutes(routing_controllers_1.getMetadataArgsStorage())[0];
    });
    it('sets path parameter always as required regardless of options', () => {
        expect(src_1.getPathParams(route)[0].required).toEqual(true);
        route.options.defaults = { paramOptions: { required: false } };
        expect(src_1.getPathParams(route)[0].required).toEqual(true);
    });
    it('sets query parameter optional by default', () => {
        expect(src_1.getQueryParams(route)[0].required).toEqual(false);
    });
    it('sets query parameter required as per global options', () => {
        route.options.defaults = { paramOptions: { required: true } };
        expect(src_1.getQueryParams(route)[0].required).toEqual(true);
    });
    it('uses local required option over the global one', () => {
        route.options.defaults = { paramOptions: { required: true } };
        expect(src_1.getQueryParams(route)[1].required).toEqual(false);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9ucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib3B0aW9ucy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZEQU00QjtBQUU1QixnQ0FBMkU7QUFFM0UsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7SUFDdkIsSUFBSSxLQUFhLENBQUE7SUFFakIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLDRDQUFzQixFQUFFLENBQUMsS0FBSyxFQUFFLENBQUE7UUFFaEMsTUFBTSxjQUFjO1NBQUc7UUFJdkIsSUFBTSxlQUFlO1FBRHJCLDZCQUE2QjtRQUM3QixNQUFNLGVBQWU7WUFFbkIsVUFBVSxDQUNZLEtBQWEsRUFFakMsR0FBVyxFQUNILEtBQXFCO2dCQUU3QixPQUFNO1lBQ1IsQ0FBQztTQUNGLENBQUE7UUFSQztZQURDLDBCQUFJLENBQUMsVUFBVSxDQUFDO1lBRWQsbUJBQUEsZ0NBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNsQixtQkFBQSxnQ0FBVSxDQUFDLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO1lBRXJDLG1CQUFBLDBCQUFJLEVBQUUsQ0FBQTs7cUVBQVEsY0FBYzs7eURBRzlCO1FBVEcsZUFBZTtZQUZwQixvQ0FBYyxDQUFDLFFBQVEsQ0FBQztZQUN6Qiw2QkFBNkI7V0FDdkIsZUFBZSxDQVVwQjtRQUVELEtBQUssR0FBRyxpQkFBVyxDQUFDLDRDQUFzQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNsRCxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyw4REFBOEQsRUFBRSxHQUFHLEVBQUU7UUFDdEUsTUFBTSxDQUFDLG1CQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRXRELEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLEVBQUUsWUFBWSxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUE7UUFDOUQsTUFBTSxDQUFDLG1CQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3hELENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtRQUNsRCxNQUFNLENBQUMsb0JBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDMUQsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMscURBQXFELEVBQUUsR0FBRyxFQUFFO1FBQzdELEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLEVBQUUsWUFBWSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUE7UUFDN0QsTUFBTSxDQUFDLG9CQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3pELENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRTtRQUN4RCxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxFQUFFLFlBQVksRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFBO1FBQzdELE1BQU0sQ0FBQyxvQkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUMxRCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIn0=