# routing-controllers-openapi
[![Build Status](https://travis-ci.org/epiphone/routing-controllers-openapi.svg?token=LxSHquEwyhSfU8JddMyx&branch=master)](https://travis-ci.com/epiphone/routing-controllers-openapi) [![codecov](https://codecov.io/gh/epiphone/routing-controllers-openapi/branch/master/graph/badge.svg)](https://codecov.io/gh/epiphone/routing-controllers-openapi) [![npm version](https://badge.fury.io/js/routing-controllers-openapi.svg)](https://badge.fury.io/js/routing-controllers-openapi)

Runtime OpenAPI v3 schema generation for routing-controllers. **Work in progress!**

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

`routingControllerOptions` refers to the options object used to configure `routing-controllers`. Pass in the same options here to have your [`routePrefix`](https://github.com/typestack/routing-controllers/#prefix-all-controllers-routes) and [`defaults`](https://github.com/typestack/routing-controllers/#default-settings) options reflected in the resulting OpenAPI spec.

`additionalProperties` is a partial [OpenAPI object](https://swagger.io/specification/#openapi-object-17) that gets merged into the result spec. You can for example set your own [`info`](https://swagger.io/specification/#openapi-object-19) or [`components`](https://swagger.io/specification/#components-object-33) keywords here.

### Validation classes

Use [`class-validator-jsonschema`](https://github.com/epiphone/class-validator-jsonschema) to convert your validation classes into OpenAPI-compatible schemas:

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

## Supported features

- [x] `@Controller`/`@JsonController` base route and default content-type
- [x] `options.routePrefix`
- [x] `@Get`, `@Post` and other action decorators
- [x] parse path parameters straight from path strings and optionally supplement with `@Param` decorator
- [x] `@QueryParam` and `@QueryParams`
- [x] `@Body`
- [x] parse response keywords from `@HttpCode` and `@ContentType` values
- [x] global `options.defaults.paramOptions.required` option and local override with `{required: true}` in decorator params
- [x] parse `summary`, `operationId` and `tags` keywords from controller/method names

## TODO
- [ ] improved documents, including samples
- [ ] response type and status decorators
- [ ] `@HeaderParam` and other header decorators such as `@ContentType`
- [ ] auth decorators
- [ ] regex routes and [suffixes in path params](https://expressjs.com/en/guide/routing.html), e.g. `/users/:id(\d+)`
- [ ] a decorator function for overriding schema keywords

## Related projects

- inspired by [`tsoa`](https://github.com/lukeautry/tsoa)
- use your Mongoose models in the spec with [mongoose-schema-jsonschema](https://github.com/DScheglov/mongoose-schema-jsonschema)
- [`openapi3-ts`](https://github.com/metadevpro/openapi3-ts/) Typescript OpenAPI utilities
