# routing-controllers-openapi
[![Build Status](https://travis-ci.org/epiphone/routing-controllers-openapi.svg?token=LxSHquEwyhSfU8JddMyx&branch=master)](https://travis-ci.com/epiphone/routing-controllers-openapi) [![codecov](https://codecov.io/gh/epiphone/class-validator-jsonschema/branch/master/graph/badge.svg)](https://codecov.io/gh/epiphone/class-validator-jsonschema) [![npm version](https://badge.fury.io/js/class-validator-jsonschema.svg)](https://badge.fury.io/js/class-validator-jsonschema)

Runtime OpenAPI v3 schema generation for routing-controllers.

**Work in progress!**

## TODO
- [ ] parse `routing-controllers` paths
- [x] parse `class-validator` schemas
- [ ] documents (incl. Mongoose sample)
- [ ] sample
- [ ] [validation messages](https://github.com/pleerock/class-validator#validation-messages)?
- [x] conditional validation: `isOptional`
- [ ] handling mismatch e.g. `@IsString() id: number`
- [ ] response values, content-types
- [ ] handle regexp suffix in path params, e.g. `/users/:id(\d+)` https://expressjs.com/en/guide/routing.html
