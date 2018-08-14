"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class ModelDto {
}
tslib_1.__decorate([
    class_validator_1.IsEmail(),
    tslib_1.__metadata("design:type", String)
], ModelDto.prototype, "email", void 0);
tslib_1.__decorate([
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], ModelDto.prototype, "username", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(), class_validator_1.IsInt(),
    tslib_1.__metadata("design:type", Number)
], ModelDto.prototype, "age", void 0);
exports.ModelDto = ModelDto;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kZWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFEQUFxRTtBQUVyRSxNQUFhLFFBQVE7Q0FJcEI7QUFIYztJQUFWLHlCQUFPLEVBQUU7O3VDQUFjO0FBQ1o7SUFBWCwwQkFBUSxFQUFFOzswQ0FBaUI7QUFDTDtJQUF0Qiw0QkFBVSxFQUFFLEVBQUUsdUJBQUssRUFBRTs7cUNBQVk7QUFIdEMsNEJBSUMifQ==