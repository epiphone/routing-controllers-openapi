import {
  ContentType,
  Controller,
  Get,
  getMetadataArgsStorage,
  HttpCode,
  JsonController,
  Param,
} from 'routing-controllers'

import {
  getOperation,
  getTags,
  IRoute,
  OpenAPI,
  parseRoutes,
  ResponseSchema,
} from '../src'
import { ModelDto } from './fixtures/models'

type IndexedRoutes = {
  [method: string]: IRoute
}

describe('decorators', () => {
  let routes: IndexedRoutes

  beforeEach(() => {
    getMetadataArgsStorage().reset()

    @JsonController('/users')
    // @ts-ignore: not referenced
    class UsersController {
      @Get('/')
      @OpenAPI({
        description: 'List all users',
      })
      listUsers() {
        return
      }

      @Get('/:userId')
      @OpenAPI((source, route) => ({
        ...source,
        tags: [...getTags(route), 'custom-tag'],
      }))
      getUser(@Param('userId') _userId: number) {
        return
      }

      @Get('/multipleOpenAPIsWithObjectParam')
      @OpenAPI({
        summary: 'Some summary',
        ['x-custom-key']: 'This will be overwritten',
      })
      @OpenAPI({
        description: 'Some description',
        ['x-custom-key']: 'Custom value',
      })
      multipleOpenAPIsWithObjectParam() {
        return
      }

      @Get('/multipleOpenAPIsWithFunctionParam')
      @OpenAPI((source, _route) => ({
        ...source,
        summary: 'Some summary',
        'x-custom-key': 10,
      }))
      @OpenAPI((source, _route) => ({
        ...source,
        description: 'Some description',
        'x-custom-key': source['x-custom-key'] * 2,
      }))
      multipleOpenAPIsWithFunctionParam() {
        return
      }

      @Get('/multipleOpenAPIsWithMixedParam')
      @OpenAPI({
        summary: 'Some summary',
        'x-custom-key': 10,
      })
      @OpenAPI((source, _route) => ({
        ...source,
        description: 'Some description',
        'x-custom-key': source['x-custom-key'] * 2,
      }))
      multipleOpenAPIsWithMixedParam() {
        return
      }

      @Get('/responseSchemaDefaults')
      @ResponseSchema(ModelDto)
      responseSchemaDefaults() {
        return
      }

      @Get('/responseSchemaOptions')
      @ResponseSchema(ModelDto, {
        contentType: 'text/csv',
        description: 'Bad request',
        statusCode: 400,
      })
      responseSchemaOptions() {
        return
      }

      @Get('/responseSchemaDecorators')
      @HttpCode(201)
      @ContentType('application/pdf')
      @ResponseSchema(ModelDto)
      responseSchemaDecorators() {
        return
      }

      @Get('/responseSchemaArray')
      @ResponseSchema(ModelDto, { isArray: true })
      responseSchemaArray() {
        return
      }

      @Get('/responseSchemaDecoratorAndOptions')
      @HttpCode(201)
      @ContentType('application/pdf')
      @ResponseSchema(ModelDto, { statusCode: 400, contentType: 'text/csv' })
      responseSchemaDecoratorAndSchema() {
        return
      }

      @Get('/responseSchemaModelAsString')
      @ResponseSchema('MyModelName', {
        contentType: 'text/csv',
        statusCode: 400,
      })
      responseSchemaModelAsString() {
        return
      }

      @Get('/responseSchemaNotOverwritingInnerOpenApiDecorator')
      @ResponseSchema('MyModelName', {
        contentType: 'text/csv',
        statusCode: 400,
      })
      @OpenAPI({ description: 'somedescription' })
      responseSchemaNotOverwritingInnerOpenApiDecorator() {
        return
      }

      @Get('/responseSchemaNotOverwritingOuterOpenApiDecorator')
      @OpenAPI({ description: 'somedescription' })
      @ResponseSchema('MyModelName', {
        contentType: 'text/csv',
        statusCode: 400,
      })
      responseSchemaNotOverwritingOuterOpenApiDecorator() {
        return
      }

      @Get('/responseSchemaNoNoModel')
      @ResponseSchema('', { statusCode: 400, contentType: 'text/csv' })
      responseSchemaNoNoModel() {
        return
      }

      @Get('/multipleResponseSchemas')
      @ResponseSchema('MySuccessObject', {
        description: 'Some successful response object',
        statusCode: 200,
      })
      @ResponseSchema('BadRequestErrorObject', {
        contentType: 'text/html',
        statusCode: 400,
      })
      @ResponseSchema('NotFoundErrorObject', {
        contentType: 'text/csv',
        statusCode: 404,
      })
      multipleResponseSchemas() {
        return
      }

      @Get('/twoResponseSchemaSameStatusCode')
      @ResponseSchema('SuccessObject1')
      @ResponseSchema('SuccessObject2')
      twoResponseSchemasSameStatusCode() {
        return
      }

      @Get('/threeResponseSchemaSameStatusCode')
      @ResponseSchema('SuccessObject1')
      @ResponseSchema('SuccessObject2')
      @ResponseSchema('SuccessObject3')
      threeResponseSchemasSameStatusCode() {
        return
      }

      @Get('/twoResponseSchemaSameStatusCodeWithOneArraySchema')
      @ResponseSchema('SuccessObjects1', { isArray: true })
      @ResponseSchema('SuccessObject2')
      twoResponseSchemaSameStatusCodeWithOneArraySchema() {
        return
      }

      @Get('/fourResponseSchemasMixedStatusCodeWithTwoArraySchemas')
      @ResponseSchema('SuccessObjects1', { isArray: true })
      @ResponseSchema('CreatedObject2', { statusCode: 201 })
      @ResponseSchema('CreatedObjects3', { statusCode: 201, isArray: true })
      @ResponseSchema('BadRequestObject4', { statusCode: 400 })
      fourResponseSchemasMixedStatusCodeWithTwoArraySchemas() {
        return
      }
    }

    @Controller('/usershtml')
    // @ts-ignore: not referenced
    class UsersHtmlController {
      @Get('/responseSchemaDefaultsHtml')
      @ResponseSchema(ModelDto)
      responseSchemaDefaultsHtml() {
        return
      }
    }

    routes = parseRoutes(getMetadataArgsStorage()).reduce((acc, route) => {
      acc[route.action.method] = route
      return acc
    }, {} as IndexedRoutes)
  })

  it('merges keywords defined in @OpenAPI decorator into operation', () => {
    const operation = getOperation(routes.listUsers, {})
    expect(operation.description).toEqual('List all users')
  })

  it('applies @OpenAPI decorator function parameter to operation', () => {
    const operation = getOperation(routes.getUser, {})
    expect(operation.tags).toEqual(['Users', 'custom-tag'])
  })

  it('merges consecutive @OpenAPI object parameters top-down', () => {
    const operation = getOperation(routes.multipleOpenAPIsWithObjectParam, {})
    expect(operation.summary).toEqual('Some summary')
    expect(operation.description).toEqual('Some description')
    expect(operation['x-custom-key']).toEqual('Custom value')
  })

  it('applies consecutive @OpenAPI function parameters top-down', () => {
    const operation = getOperation(routes.multipleOpenAPIsWithFunctionParam, {})
    expect(operation.summary).toEqual('Some summary')
    expect(operation.description).toEqual('Some description')
    expect(operation['x-custom-key']).toEqual(20)
  })

  it('merges and applies consecutive @OpenAPI object and function parameters top-down', () => {
    const operation = getOperation(routes.multipleOpenAPIsWithMixedParam, {})
    expect(operation.summary).toEqual('Some summary')
    expect(operation.description).toEqual('Some description')
    expect(operation['x-custom-key']).toEqual(20)
  })

  it('applies @ResponseSchema merging in response schema into source metadata', () => {
    const operation = getOperation(routes.responseSchemaDefaults, {})
    // ensure other metadata doesnt get overwritten by decorator
    expect(operation.operationId).toEqual(
      'UsersController.responseSchemaDefaults'
    )
  })

  it('applies @ResponseSchema using default contentType and statusCode', () => {
    const operation = getOperation(routes.responseSchemaDefaults, {})
    expect(operation.responses).toEqual({
      '200': {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ModelDto',
            },
          },
        },
        description: '',
      },
    })
  })

  it('applies @ResponseSchema using contentType and statusCode from options object', () => {
    const operation = getOperation(routes.responseSchemaOptions, {})
    expect(operation.responses).toEqual({
      '200': {
        content: {
          'application/json': {},
        },
        description: 'Successful response',
      },
      '400': {
        content: {
          'text/csv': {
            schema: {
              $ref: '#/components/schemas/ModelDto',
            },
          },
        },
        description: 'Bad request',
      },
    })
  })

  it('applies @ResponseSchema using contentType and statusCode from decorators', () => {
    const operation = getOperation(routes.responseSchemaDecorators, {})
    expect(operation.responses['201'].content['application/pdf']).toEqual({
      schema: { $ref: '#/components/schemas/ModelDto' },
    })
  })

  it('applies @ResponseSchema using isArray flag set to true', () => {
    const operation = getOperation(routes.responseSchemaArray, {})
    expect(operation.responses['200'].content['application/json']).toEqual({
      schema: {
        items: {
          $ref: '#/components/schemas/ModelDto',
        },
        type: 'array',
      },
    })
  })

  it('applies @ResponseSchema using contentType and statusCode from options object, overruling options from RC decorators', () => {
    const operation = getOperation(routes.responseSchemaDecoratorAndSchema, {})
    expect(operation.responses).toEqual({
      '201': {
        content: {
          'application/pdf': {},
        },
        description: 'Successful response',
      },
      '400': {
        content: {
          'text/csv': {
            schema: { $ref: '#/components/schemas/ModelDto' },
          },
        },
        description: '',
      },
    })
  })

  it('applies @ResponseSchema using a string as ModelName', () => {
    const operation = getOperation(routes.responseSchemaModelAsString, {})
    expect(operation.responses).toEqual({
      '200': {
        content: {
          'application/json': {},
        },
        description: 'Successful response',
      },
      '400': {
        content: {
          'text/csv': {
            schema: { $ref: '#/components/schemas/MyModelName' },
          },
        },
        description: '',
      },
    })
  })

  it('applies @ResponseSchema while retaining inner OpenAPI decorator', () => {
    const operation = getOperation(
      routes.responseSchemaNotOverwritingInnerOpenApiDecorator,
      {}
    )
    expect(operation.description).toEqual('somedescription')
    expect(operation.responses).toEqual({
      '200': {
        content: {
          'application/json': {},
        },
        description: 'Successful response',
      },
      '400': {
        content: {
          'text/csv': {
            schema: { $ref: '#/components/schemas/MyModelName' },
          },
        },
        description: '',
      },
    })
  })

  it('applies @ResponseSchema while retaining outer OpenAPI decorator', () => {
    const operation = getOperation(
      routes.responseSchemaNotOverwritingOuterOpenApiDecorator,
      {}
    )
    expect(operation.description).toEqual('somedescription')
    expect(operation.responses).toEqual({
      '200': {
        content: {
          'application/json': {},
        },
        description: 'Successful response',
      },
      '400': {
        content: {
          'text/csv': {
            schema: { $ref: '#/components/schemas/MyModelName' },
          },
        },
        description: '',
      },
    })
  })

  it('does not apply @ResponseSchema if empty ModelName is passed', () => {
    const operation = getOperation(routes.responseSchemaNoNoModel, {})
    expect(operation.responses).toEqual({
      '200': {
        content: {
          'application/json': {},
        },
        description: 'Successful response',
      },
    })
  })

  it('applies @ResponseSchema using default contentType and statusCode from @Controller (non-json)', () => {
    const operation = getOperation(routes.responseSchemaDefaultsHtml, {})
    expect(operation.responses).toEqual({
      '200': {
        content: {
          'text/html; charset=utf-8': {
            schema: {
              $ref: '#/components/schemas/ModelDto',
            },
          },
        },
        description: '',
      },
    })
  })

  it('applies multiple @ResponseSchema on a single handler', () => {
    const operation = getOperation(routes.multipleResponseSchemas, {})
    expect(operation.responses).toEqual({
      '200': {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/MySuccessObject',
            },
          },
        },
        description: 'Some successful response object',
      },
      '400': {
        content: {
          'text/html': {
            schema: {
              $ref: '#/components/schemas/BadRequestErrorObject',
            },
          },
        },
        description: '',
      },
      '404': {
        content: {
          'text/csv': {
            schema: {
              $ref: '#/components/schemas/NotFoundErrorObject',
            },
          },
        },
        description: '',
      },
    })
  })

  it('applies two @ResponseSchema with same status code', () => {
    const operation = getOperation(routes.twoResponseSchemasSameStatusCode, {})
    expect(operation.responses).toEqual({
      '200': {
        content: {
          'application/json': {
            schema: {
              oneOf: [
                { $ref: '#/components/schemas/SuccessObject1' },
                { $ref: '#/components/schemas/SuccessObject2' },
              ],
            },
          },
        },
        description: '',
      },
    })
  })

  it('applies three @ResponseSchema with same status code', () => {
    const operation = getOperation(
      routes.threeResponseSchemasSameStatusCode,
      {}
    )
    expect(operation.responses).toEqual({
      '200': {
        content: {
          'application/json': {
            schema: {
              oneOf: [
                { $ref: '#/components/schemas/SuccessObject1' },
                { $ref: '#/components/schemas/SuccessObject2' },
                { $ref: '#/components/schemas/SuccessObject3' },
              ],
            },
          },
        },
        description: '',
      },
    })
  })

  it('applies two @ResponseSchema with same status code, where one of them is an array', () => {
    const operation = getOperation(
      routes.twoResponseSchemaSameStatusCodeWithOneArraySchema,
      {}
    )
    expect(operation.responses).toEqual({
      '200': {
        content: {
          'application/json': {
            schema: {
              oneOf: [
                {
                  items: {
                    $ref: '#/components/schemas/SuccessObjects1',
                  },
                  type: 'array',
                },
                { $ref: '#/components/schemas/SuccessObject2' },
              ],
            },
          },
        },
        description: '',
      },
    })
  })

  it('applies four @ResponseSchema with mixed status code, where two of them are arrays', () => {
    const operation = getOperation(
      routes.fourResponseSchemasMixedStatusCodeWithTwoArraySchemas,
      {}
    )
    expect(operation.responses).toEqual({
      '200': {
        content: {
          'application/json': {
            schema: {
              items: {
                $ref: '#/components/schemas/SuccessObjects1',
              },
              type: 'array',
            },
          },
        },
        description: '',
      },
      '201': {
        content: {
          'application/json': {
            schema: {
              oneOf: [
                { $ref: '#/components/schemas/CreatedObject2' },
                {
                  items: {
                    $ref: '#/components/schemas/CreatedObjects3',
                  },
                  type: 'array',
                },
              ],
            },
          },
        },
        description: '',
      },
      '400': {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/BadRequestObject4',
            },
          },
        },
        description: '',
      },
    })
  })
})

describe('@OpenAPI-decorated class', () => {
  let routes: IndexedRoutes

  beforeEach(() => {
    getMetadataArgsStorage().reset()

    @OpenAPI({
      externalDocs: { url: 'http://docs.com' },
    })
    @Controller('/items')
    @OpenAPI({
      description: 'Common description',
      security: [{ basicAuth: [] }],
    })
    // @ts-ignore: not referenced
    class Item {
      @Get('/')
      @OpenAPI({
        description: 'List all items',
        summary: 'Method-specific summary',
      })
      listItems() {
        return
      }

      @Get('/')
      @OpenAPI((op) => ({ ...op, security: [] }))
      getItem() {
        return
      }
    }

    routes = parseRoutes(getMetadataArgsStorage()).reduce((acc, route) => {
      acc[route.action.method] = route
      return acc
    }, {} as IndexedRoutes)
  })

  it('applies controller OpenAPI props to each method with method-specific props taking precedence', () => {
    expect(getOperation(routes.listItems, {})).toEqual(
      expect.objectContaining({
        description: 'List all items',
        externalDocs: { url: 'http://docs.com' },
        security: [{ basicAuth: [] }],
        summary: 'Method-specific summary',
      })
    )

    expect(getOperation(routes.getItem, {})).toEqual(
      expect.objectContaining({
        description: 'Common description',
        externalDocs: { url: 'http://docs.com' },
        security: [],
        summary: 'Get item',
      })
    )
  })
})
