# routing-controllers-openapi

[![codecov](https://codecov.io/gh/epiphone/routing-controllers-openapi/branch/master/graph/badge.svg)](https://codecov.io/gh/epiphone/routing-controllers-openapi) [![npm version](https://badge.fury.io/js/routing-controllers-openapi.svg)](https://badge.fury.io/js/routing-controllers-openapi)

Runtime OpenAPI v3 schema generation for [routing-controllers](https://github.com/typestack/routing-controllers).

## Installation

`npm install --save routing-controllers-openapi`

## Usage

```typescript
import { getMetadataArgsStorage } from 'routing-controllers'
import { routingControllersToSpec } from 'routing-controllers-openapi'

// Define your controllers as usual:

@JsonController('/users')
class UsersController {
  @Get('/:userId')
  getUser(@Param('userId') userId: string) {
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
        "operationId": "UsersController.getUser",
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
        "tags": ["Users"]
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
        "tags": ["Users"]
      }
    }
  }
}
```

Check [`/sample`](/sample) for a complete sample application.

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

const schemas = validationMetadatasToSchemas({
  refPointerPrefix: '#/components/schemas/',
})

const spec = routingControllersToSpec(storage, routingControllerOptions, {
  components: { schemas },
  info: { title: 'My app', version: '1.2.0' },
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
        description: 'Bad request',
      },
    },
  })
  listUsers() {
    // ...
  }
}
```

The parameter object consists of any number of properties from the [Operation object](https://swagger.io/specification/#operationObject). These properties are then merged into the spec, overwriting any existing values.

Alternatively you can call `@OpenAPI` with a function of type `(source: OperationObject, route: IRoute) => OperationObject`, i.e. a function receiving the existing spec as well as the target route, spitting out an updated spec. This function parameter can be used to implement for example your own merging logic or custom decorators.

#### Multiple `@OpenAPI` decorators

A single handler can be decorated with multiple `@OpenAPI`s. Note though that since decorators are applied top-down, any possible duplicate keys are overwritten by subsequent decorators:

```typescript
  @OpenAPI({
    summary: 'This value will be overwritten!',
    description: 'This value will remain'
  })
  @OpenAPI({
    summary: 'This value will remain'
  })
  listUsers() {
    // ...
  }
```

Multiple `@OpenAPI`s are merged together with [`lodash/merge`](https://lodash.com/docs/4.17.11#merge) which has [a few interesting properties](https://github.com/lodash/lodash/issues/1313) to keep in mind when it comes to arrays. Use the function parameter described above when strict control over merging logic is required.

#### Class `@OpenAPI` decorator

Using `@OpenAPI` on the controller class effectively applies given spec to each class method. Method-level `@OpenAPI`s are merged into class specs, with the former having precedence:

```typescript
@OpenAPI({
  security: [{ basicAuth: [] }], // Applied to each method
})
@JsonController('/users')
export class UsersController {
  // ...
}
```

### Annotating response schemas

Extracting response types automatically in runtime isn't currently allowed by Typescript's reflection system. Specifically the problem is that `routing-controllers-openapi` can't unwrap generic types like Promise<MyModel> or Array<MyModel>: see e.g. [here](https://github.com/Microsoft/TypeScript/issues/10576) for discussion. As a workaround you can use the `@ResponseSchema` decorator to supply the response body schema:

```typescript
import { ResponseSchema } from 'routing-controllers-openapi'

@JsonController('/users')
export class UsersController {
  @Get('/:id')
  @ResponseSchema(User)
  getUser() {
    // ...
  }
}
```

`@ResponseSchema` takes as an argument either a class-validator class or a plain string schema name. You can also supply an optional secondary `options` argument:

```typescript
  @Post('/')
  @ResponseSchema(User, {
    contentType: 'text/csv',
    description: 'A list of created user objects',
    isArray: true
    statusCode: '201'})
  createUsers() {
    // ...
  }
```

`contentType` and `statusCode` default to routing-controller's `@ContentType` and `@HttpCode` values. To specify a response schema of an array, set `options.isArray` as `true`. You can also annotate a single handler with multiple `ResponseSchema`s to specify responses with different status codes.

Note that when using `@ResponseSchema` together with `@JSONSchema`, the outer decorator will overwrite keys of inner decorators. So in the following example, information from `@ResponseSchema` would be overwritten by `@JSONSchema`:

```typescript
@JSONSchema({responses: {
  '200': {
    'content': {
      'application/json': {
        schema: {
          '$ref': '#/components/schemas/Pet'
        }
      }
    }
  }
}})
@ResponseSchema(SomeResponseObject)
handler() { ... }
```

#### Multiple ResponseSchemas

Multiple ResponseSchemas with different status codes are supported as follows.

```typescript
@ResponseSchema(Response1)
@ResponseSchema(Response2, {statusCode: '400'})
```

In case of multiple ResponseSchemas being registered with the same status code, we resolve them
using the [oneOf](https://swagger.io/docs/specification/data-models/oneof-anyof-allof-not/#oneof) operator.

```typescript
@ResponseSchema(Response1)
@ResponseSchema(Response2)
```

will generate

```json
"200": {
  "content": {
    "application/json":{
      "schema": {
        "oneOf": [
          {$ref: "#/components/schemas/Response1"},
          {$ref: "#/components/schemas/Response2"}
        ]
      }
    }
  }
}
```

## Supported features

- `@Controller`/`@JsonController` base route and default content-type
- `options.routePrefix`
- `@Get`, `@Post` and other action decorators
- Parse path parameters straight from path strings and optionally supplement with `@Param` decorator
  - Regex and optional path parameters (e.g. `/users/:id(\d+)/:type?`) are also supported
- `@QueryParam` and `@QueryParams`
- `@HeaderParam` and `@HeaderParams`
- `@Body` and `@BodyParam`
- Parse response keywords from `@HttpCode` and `@ContentType` values
- Global `options.defaults.paramOptions.required` option and local override with `{required: true}` in decorator params
- Parse `summary`, `operationId` and `tags` keywords from controller/method names

## Future work

- Support for routing-controller's [authorization features](https://github.com/typestack/routing-controllers#using-authorization-features)

Feel free to submit a PR!

## Related projects

- Inspired by [tsoa](https://github.com/lukeautry/tsoa) and [trafficlight](https://github.com/swimlane/trafficlight)
- Include your Mongoose models in the spec with [mongoose-schema-jsonschema](https://github.com/DScheglov/mongoose-schema-jsonschema)
- Generate JSON schema from your Typescript sources with [typescript-json-schema](https://github.com/YousefED/typescript-json-schema)
- [openapi3-ts](https://github.com/metadevpro/openapi3-ts/) provides handy OpenAPI utilities for Typescript
- Convert OpenAPI 3 spec to **Swagger 2** with [api-spec-converter](https://github.com/LucyBot-Inc/api-spec-converter)
- Generate Typescript interface definitions from SQL database schema with [schemats](https://github.com/SweetIQ/schemats)
