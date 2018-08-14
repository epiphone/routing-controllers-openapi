"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// tslint:disable:no-implicit-dependencies
const class_validator_1 = require("class-validator");
const routing_controllers_1 = require("routing-controllers");
const src_1 = require("../../src");
class CreateUserBody {
}
tslib_1.__decorate([
    class_validator_1.IsEmail(),
    tslib_1.__metadata("design:type", String)
], CreateUserBody.prototype, "email", void 0);
exports.CreateUserBody = CreateUserBody;
class CreatePostBody {
}
tslib_1.__decorate([
    class_validator_1.IsString({ each: true }),
    tslib_1.__metadata("design:type", Array)
], CreatePostBody.prototype, "content", void 0);
exports.CreatePostBody = CreatePostBody;
class ListUsersQueryParams {
}
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsEmail(),
    tslib_1.__metadata("design:type", String)
], ListUsersQueryParams.prototype, "email", void 0);
tslib_1.__decorate([
    class_validator_1.IsString({ each: true }),
    tslib_1.__metadata("design:type", Array)
], ListUsersQueryParams.prototype, "types", void 0);
exports.ListUsersQueryParams = ListUsersQueryParams;
class ListUsersHeaderParams {
}
tslib_1.__decorate([
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], ListUsersHeaderParams.prototype, "Authorization", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], ListUsersHeaderParams.prototype, "X-Correlation-ID", void 0);
exports.ListUsersHeaderParams = ListUsersHeaderParams;
let UsersController = class UsersController {
    listUsers(_query, _header) {
        return;
    }
    listUsersInRange(_to, _emptyQuery, _userId) {
        return;
    }
    getUser(_userId, _emptyHeader, _xRequestedWith) {
        return;
    }
    createUser(_body) {
        return;
    }
    createUserPost(_body) {
        return;
    }
    deleteUsersByVersion() {
        return;
    }
    putUserDefault() {
        return;
    }
};
tslib_1.__decorate([
    routing_controllers_1.Get('/'),
    routing_controllers_1.ContentType('text/cvs'),
    src_1.OpenAPI({ description: 'List all users' }),
    tslib_1.__param(0, routing_controllers_1.QueryParams()),
    tslib_1.__param(1, routing_controllers_1.HeaderParams()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [ListUsersQueryParams,
        ListUsersHeaderParams]),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "listUsers", null);
tslib_1.__decorate([
    routing_controllers_1.Get('/:from-:to'),
    src_1.OpenAPI({ responses: { '400': { description: 'Bad request' } } }),
    tslib_1.__param(0, routing_controllers_1.Param('to')),
    tslib_1.__param(1, routing_controllers_1.QueryParam('')),
    tslib_1.__param(2, routing_controllers_1.QueryParam('userId', { required: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String, Number]),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "listUsersInRange", null);
tslib_1.__decorate([
    routing_controllers_1.Get('/:userId?'),
    tslib_1.__param(0, routing_controllers_1.Param('userId')),
    tslib_1.__param(1, routing_controllers_1.HeaderParam('')),
    tslib_1.__param(2, routing_controllers_1.HeaderParam('X-Requested-With')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String, String]),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "getUser", null);
tslib_1.__decorate([
    routing_controllers_1.HttpCode(201),
    routing_controllers_1.Post('/'),
    tslib_1.__param(0, routing_controllers_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [CreateUserBody]),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "createUser", null);
tslib_1.__decorate([
    routing_controllers_1.Post('/:userId/posts'),
    tslib_1.__param(0, routing_controllers_1.Body({ required: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [CreatePostBody]),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "createUserPost", null);
tslib_1.__decorate([
    routing_controllers_1.Delete('/:version(v?\\d{1}|all)'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "deleteUsersByVersion", null);
tslib_1.__decorate([
    src_1.OpenAPI({
        deprecated: true,
        description: 'Insert or update a user object - DEPRECATED in v1.0.1',
        summary: ''
    }),
    routing_controllers_1.Put(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "putUserDefault", null);
UsersController = tslib_1.__decorate([
    routing_controllers_1.JsonController('/users')
], UsersController);
exports.UsersController = UsersController;
let UserPostsController = class UserPostsController {
    getUserPost(_userId, _postId) {
        return;
    }
};
tslib_1.__decorate([
    routing_controllers_1.Get('/:postId'),
    tslib_1.__param(0, routing_controllers_1.Param('userId')),
    tslib_1.__param(1, routing_controllers_1.Param('postId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", void 0)
], UserPostsController.prototype, "getUserPost", null);
UserPostsController = tslib_1.__decorate([
    routing_controllers_1.Controller('/users/:userId/posts')
], UserPostsController);
exports.UserPostsController = UserPostsController;
let RootController = class RootController {
    getDefaultPath() {
        return;
    }
    getStringPath() {
        return;
    }
};
tslib_1.__decorate([
    routing_controllers_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], RootController.prototype, "getDefaultPath", null);
tslib_1.__decorate([
    routing_controllers_1.Get('/stringPath'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], RootController.prototype, "getStringPath", null);
RootController = tslib_1.__decorate([
    routing_controllers_1.Controller()
], RootController);
exports.RootController = RootController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbGxlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb250cm9sbGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBMEM7QUFDMUMscURBQStEO0FBQy9ELDZEQWU0QjtBQUU1QixtQ0FBbUM7QUFFbkMsTUFBYSxjQUFjO0NBRTFCO0FBRFk7SUFBVix5QkFBTyxFQUFFOzs2Q0FBYztBQUQxQix3Q0FFQztBQUVELE1BQWEsY0FBYztDQUcxQjtBQURDO0lBREMsMEJBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQzs7K0NBQ1I7QUFGbkIsd0NBR0M7QUFFRCxNQUFhLG9CQUFvQjtDQU9oQztBQUpDO0lBRkMsNEJBQVUsRUFBRTtJQUNaLHlCQUFPLEVBQUU7O21EQUNJO0FBR2Q7SUFEQywwQkFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDOzttREFDVjtBQU5qQixvREFPQztBQUVELE1BQWEscUJBQXFCO0NBTWpDO0FBTGE7SUFBWCwwQkFBUSxFQUFFOzs0REFBc0I7QUFJakM7SUFGQyw0QkFBVSxFQUFFO0lBQ1osMEJBQVEsRUFBRTs7K0RBQ2U7QUFMNUIsc0RBTUM7QUFHRCxJQUFhLGVBQWUsR0FBNUIsTUFBYSxlQUFlO0lBSTFCLFNBQVMsQ0FDUSxNQUE2QixFQUM1QixPQUErQjtRQUUvQyxPQUFNO0lBQ1IsQ0FBQztJQUlELGdCQUFnQixDQUNELEdBQVcsRUFDUixXQUFtQixFQUVuQyxPQUFlO1FBRWYsT0FBTTtJQUNSLENBQUM7SUFHRCxPQUFPLENBQ1ksT0FBZSxFQUNmLFlBQW9CLEVBQ0osZUFBdUI7UUFFeEQsT0FBTTtJQUNSLENBQUM7SUFJRCxVQUFVLENBQVMsS0FBcUI7UUFDdEMsT0FBTTtJQUNSLENBQUM7SUFHRCxjQUFjLENBRVosS0FBcUI7UUFFckIsT0FBTTtJQUNSLENBQUM7SUFHRCxvQkFBb0I7UUFDbEIsT0FBTTtJQUNSLENBQUM7SUFRRCxjQUFjO1FB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