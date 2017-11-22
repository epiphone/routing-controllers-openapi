# routing-controllers-openapi
[![Build Status](https://travis-ci.com/epiphone/routing-controllers-openapi.svg?token=LxSHquEwyhSfU8JddMyx&branch=master)](https://travis-ci.com/epiphone/routing-controllers-openapi)

Runtime OpenAPI v3 schema generation for routing-controllers.

## TODO
- [ ] parse paths
- [ ] parse `class-validator` schemas
- [ ] documents (incl. Mongoose sample)
- [ ] sample
- [ ] [validation messages](https://github.com/pleerock/class-validator#validation-messages)
  - basically all other `class-validator` features; inheritance, conditional validation, ...
- [ ] handling mismatch e.g. `@IsString() id: number`
