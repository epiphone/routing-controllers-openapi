# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2020-11-28
### Added
- Export `getOpenAPIMetadata` and `setOpenAPIMetadata` ([#61](https://github.com/epiphone/routing-controllers-openapi/pull/61))

## [2.1.0] - 2020-09-03
### Added
- Support multiple `@ResponseSchema` decorators using `oneOf` ([#58](https://github.com/epiphone/routing-controllers-openapi/pull/58))

## [2.0.1] - 2020-06-15
### Fixed
- `@QueryParams` object are now correctly split into separate `query` params instead of a single `object` type param ([#49](https://github.com/epiphone/routing-controllers-openapi/pull/49))

## [2.0.0] - 2020-05-04
### Changed
- Same as 2.0.0-rc1

## [2.0.0-rc1] - 2020-05-01
### Changed
- Bump `class-validator` peer dependency to `^0.12.0` - meaning we're no longer compatible with pre-0.12 versions of `class-validator`!

## [1.8.1] - 2020-04-10
### Fixed
- Restored the mistakenly removed `tslib` dependency [#42](https://github.com/epiphone/routing-controllers-openapi/issues/42)

## [1.8.0]
### Added
- Upgraded dependencies, now supporting `routing-controllers@^0.8.0` ([#33](https://github.com/epiphone/routing-controllers-openapi/issues/33))
- Moved `routing-controllers` to `peerDependencies` to get version mismatch errors while installing

## [1.7.0] - 2019-05-15
### Added
- Handle explicit `type` args in parameter decorators ([#22](https://github.com/epiphone/routing-controllers-openapi/pull/22)), thanks [gstamac](https://github.com/gstamac)!

## [1.6.0] - 2019-02-13
### Added
- Support class-level `@OpenAPI` decorators, i.e. applying same spec to each controller method
- Update dependencies

## [1.5.0] - 2019-02-01
### Added
- Handle `@BodyParam` decorator [#14](https://github.com/epiphone/routing-controllers-openapi/issues/14)

## [1.4.2] - 2018-10-10
### Fixed
- Handle explicit `type` parameter in `@Body` decorator to fix array request bodies [#12](https://github.com/epiphone/routing-controllers-openapi/issues/12).

## [1.4.1] - 2018-09-13
### Fixed
- Update `openapi3-ts` dependency to fix [type clash](https://github.com/epiphone/class-validator-jsonschema/issues/6) with `class-validator-jsonschema`

## [1.4.0] - 2018-08-24
### Added
- [@consense](https://github.com/consense) added a `ResponseSchema` decorator for specifying response body schemas [#8](https://github.com/epiphone/routing-controllers-openapi/issues/8)

## [1.3.3] - 2018-08-13
### Fixed
- Fix multiple `OpenAPI` decorators overwriting each other [#10](https://github.com/epiphone/routing-controllers-openapi/pull/10)

## [1.3.2] - 2018-08-12
### Fixed
- Fix undefined [Controller/JsonController base path](https://github.com/typestack/routing-controllers#prefix-controller-with-base-route) resolving into an `"undefined": {...}` OpenAPI route
### Added
- Include a complete sample application in [`/sample`](/sample)
- Update development dependencies

## [1.3.1] - 2018-06-22
### Fixed
- Fix empty property cleanup removing boolean properties like `deprecated` [#6](https://github.com/epiphone/routing-controllers-openapi/issues/6) (thanks [@WRostom](https://github.com/WRostom)!)

## [1.3.0] - 2018-06-17
### Added
- Handle `@HeaderParam` and `@HeaderParams` decorators [#2](https://github.com/epiphone/routing-controllers-openapi/issues/2)
### Changed
- Update dependencies

## [1.2.1] - 2018-01-21
### Fixed
- Fix handling actions with an unspecified path string [#1](https://github.com/epiphone/routing-controllers-openapi/pull/1) (thanks [@fabriciovergal](https://github.com/fabriciovergal)!)

## [1.2.0] - 2017-12-07
### Added
- Handle optional path parameters (e.g. `/users/:userId?`) and regex path parameters (`/users/:userId(\\d{6})`) with appropriate OpenAPI schema keywords

## [1.1.0] - 2017-12-03
### Added
- A `@OpenAPI` decorator for supplying actions with additional spec keywords


