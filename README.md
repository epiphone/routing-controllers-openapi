# routing-controllers-openapi
[![Build Status](https://travis-ci.org/epiphone/routing-controllers-openapi.svg?branch=master)](https://travis-ci.org/epiphone/routing-controllers-openapi) [![codecov](https://codecov.io/gh/epiphone/routing-controllers-openapi/branch/master/graph/badge.svg)](https://codecov.io/gh/epiphone/routing-controllers-openapi) [![npm version](https://badge.fury.io/js/routing-controllers-openapi.svg)](https://badge.fury.io/js/routing-controllers-openapi)

Runtime OpenAPI v3 schema generation for [routing-controllers](https://github.com/typestack/routing-controllers).

## Installation

`yarn add routing-controllers-openapi`

## Usage

```typescript
import { getMetadataArgsStorage } from 'routing-controllers'
import { routingControllersToSpec } from 'routing-controllers-openapi'

// Define your controllers as usual:

@JsonController('/users')
class UsersController {
  @Get('/:userId')
  listUsers(@Param('userId') userId: string) {
    // ...
  }

  @HttpCode(201)
  @Post('/')
  createUser(@Body() body: CreateUserBody) {
    // ...
  }
}

// Generate a schema:

const storage = getMetadataArgsStorage()
const spec = routingControllersToSpec(storage)
console.log(spec)
```

prints out the following specification:

```json
{
  "components": {
    "schemas": {}
  },
  "info": {
    "title": "",
    "version": "1.0.0"
  },
  "openapi": "3.0.0",
  "paths": {
    "/users/{userId}": {
      "get": {
        "operationId": "UsersController.listUsers",
        "parameters": [
          {
            "in": "path",
            "name": "userId",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "content": {
              "application/json": {}
            },
            "description": "Successful response"
          }
        },
        "summary": "List users",
        "tags": [
          "Users"
        ]
      }
    },
    "/users/": {
      "post": {
        "operationId": "UsersController.createUser",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateUserBody"
              }
            }
          },
          "description": "CreateUserBody",
          "required": false
        },
        "responses": {
          "201": {
            "content": {
              "application/json": {}
            },
            "description": "Successful response"
          }
        },
        "summary": "Create user",
        "tags": [
          "Users"
        ]
      }
    }
  }
}
```

### Configuration

`routingControllersToSpec` has the following type signature:

```typescript
export function routingControllersToSpec(
  storage: MetadataArgsStorage,
  routingControllerOptions: RoutingControllersOptions = {},
  additionalProperties: Partial<OpenAPIObject> = {}
): OpenAPIObject
```

`routingControllerOptions` refers to the options object used to configure routing-controllers. Pass in the same options here to have your [`routePrefix`](https://github.com/typestack/routing-controllers/#prefix-all-controllers-routes) and [`defaults`](https://github.com/typestack/routing-controllers/#default-settings) options reflected in the resulting OpenAPI spec.

`additionalProperties` is a partial [OpenAPI object](https://swagger.io/specification/#openapi-object-17) that gets merged into the result spec. You can for example set your own [`info`](https://swagger.io/specification/#openapi-object-19) or [`components`](https://swagger.io/specification/#components-object-33) keywords here.

### Validation classes

Use [class-validator-jsonschema](https://github.com/epiphone/class-validator-jsonschema) to convert your validation classes into OpenAPI-compatible schemas:

```typescript
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'

// ...

const schemas = validationMetadatasToSchemas(metadatas, {
  refPointerPrefix: '#/components/schemas'
})

const spec = routingControllersToSpec(storage, routingControllerOptions, {
  components: { schemas },
  info: { title: 'My app', version: '1.2.0' }
})
```

### Decorating with additional keywords

Use the `@OpenAPI` decorator to supply your actions with additional keywords:

```typescript
import { OpenAPI } from 'routing-controllers-openapi'

@JsonController('/users')
export class UsersController {

  @Get('/')
  @OpenAPI({
    description: 'List all available users',
    responses: {
      '400': {
        description: 'Bad request'
      }
    }
  })
  listUsers() {
    // ...
  }
}
```

The parameter object consists of any number of properties from the [Operation object](https://swagger.io/specification/#operationObject). These properties are then merged into the spec, overwriting any existing values.

Alternatively you can call `@OpenAPI` with a function of type `(source: OperationObject, route: IRoute) => OperationObject`, i.e. a function receiving the existing spec as well as the target route, spitting out an updated spec. This function parameter can be used to implement for example your own merging logic or custom decorators.

## Supported features

- `@Controller`/`@JsonController` base route and default content-type
- `options.routePrefix`
- `@Get`, `@Post` and other action decorators
- Parse path parameters straight from path strings and optionally supplement with `@Param` decorator
  - Regex and optional path parameters (e.g. `/users/:id(\d+)/:type?`) are also supported
- `@QueryParam` and `@QueryParams`
- `@HeaderParam` and `@HeaderParams`
- `@Body`
- Parse response keywords from `@HttpCode` and `@ContentType` values
- Global `options.defaults.paramOptions.required` option and local override with `{required: true}` in decorator params
- Parse `summary`, `operationId` and `tags` keywords from controller/method names

## TODO
- Support for routing-controller's [authorization features](https://github.com/typestack/routing-controllers#using-authorization-features)
- Parsing endpoint response type, using either the reflection metadata or a custom decorator

Feel free to submit a PR!

## Related projects

- Inspired by [tsoa](https://github.com/lukeautry/tsoa) and [trafficlight](https://github.com/swimlane/trafficlight)
- Include your Mongoose models in the spec with [mongoose-schema-jsonschema](https://github.com/DScheglov/mongoose-schema-jsonschema)
- [openapi3-ts](https://github.com/metadevpro/openapi3-ts/) provides handy OpenAPI utilities for Typescript
