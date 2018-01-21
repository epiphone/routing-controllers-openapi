# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.2.1] - 2018-01-21
### Fixed
- Fix handling actions with an unspecified path string [#1](https://github.com/epiphone/routing-controllers-openapi/pull/1) (thanks [@fabriciovergal](https://github.com/fabriciovergal)!)

## [1.2.0] - 2017-12-07
### Added
- Handle optional path parameters (e.g. `/users/:userId?`) and regex path parameters (`/users/:userId(\\d{6})`) with appropriate OpenAPI schema keywords

## [1.1.0] - 2017-12-03
### Added
- A `@OpenAPI` decorator for supplying actions with additional spec keywords


