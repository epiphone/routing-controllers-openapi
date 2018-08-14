import {
  Get,
  getMetadataArgsStorage,
  JsonController,
  Param,
  HttpCode,
  ContentType
} from 'routing-controllers'
import { getOperation, getTags, IRoute, OpenAPI, parseRoutes, ResponseSchema } from '../src'
import { ModelDto } from './fixtures/models'

describe('decorators', () => {
  let routes: IRoute[]

  beforeEach(() => {
    getMetadataArgsStorage().reset()

    @JsonController('/users')
    // @ts-ignore: not referenced
    class UsersController {
      @Get('/')
      @OpenAPI({
        description: 'List all users'
      })
      listUsers() {
        return
      }

      @Get('/:userId')
      @OpenAPI((source, route) => ({
        ...source,
        tags: [...getTags(route), 'custom-tag']
      }))
      getUser(@Param('userId') _userId: number) {
        return
      }

      @Get('/multipleOpenAPIsWithObjectParam')
      @OpenAPI({
        summary: 'Some summary',
        ['x-custom-key']: 'This will be overwritten'
      })
      @OpenAPI({
        description: 'Some description',
        ['x-custom-key']: 'Custom value'
      })
      multipleOpenAPIsWithObjectParam() {
        return
      }

      @Get('/multipleOpenAPIsWithFunctionParam')
      @OpenAPI((source, _route) => ({
        ...source,
        summary: 'Some summary',
        'x-custom-key': 10
      }))
      @OpenAPI((source, _route) => ({
        ...source,
        description: 'Some description',
        'x-custom-key': source['x-custom-key'] * 2
      }))
      multipleOpenAPIsWithFunctionParam() {
        return
      }

      @Get('/multipleOpenAPIsWithMixedParam')
      @OpenAPI({
        summary: 'Some summary',
        'x-custom-key': 10
      })
      @OpenAPI((source, _route) => ({
        ...source,
        description: 'Some description',
        'x-custom-key': source['x-custom-key'] * 2
      }))
      multipleOpenAPIsWithMixedParam() {
        return
      }

      @Get('/responseSchemaDefaults')
      @ResponseSchema(ModelDto)
      responseSchemaDefaults(@Param('userId') _userId: number) {
        return
      }

      @Get('/responseSchemaOptions')
      @ResponseSchema(ModelDto, {statusCode: 400, contentType: 'text/csv'})
      responseSchemaOptions(@Param('userId') _userId: number) {
        return
      }

      @Get('/responseSchemaDecorators')
      @HttpCode(201)
      @ContentType("application/pdf")
      @ResponseSchema(ModelDto)
      responseSchemaDecorators(@Param('userId') _userId: number) {
        return
      }
    }

    routes = parseRoutes(getMetadataArgsStorage())
  })

  it('merges keywords defined in @OpenAPI decorator into operation', () => {
    const operation = getOperation(routes[0])
    expect(operation.description).toEqual('List all users')
  })

  it('applies @OpenAPI decorator function parameter to operation', () => {
    const operation = getOperation(routes[1])
    expect(operation.tags).toEqual(['Users', 'custom-tag'])
  })

  it('merges consecutive @OpenAPI object parameters top-down', () => {
    const operation = getOperation(routes[2])
    expect(operation.summary).toEqual('Some summary')
    expect(operation.description).toEqual('Some description')
    expect(operation['x-custom-key']).toEqual('Custom value')
  })

  it('applies consecutive @OpenAPI function parameters top-down', () => {
    const operation = getOperation(routes[3])
    expect(operation.summary).toEqual('Some summary')
    expect(operation.description).toEqual('Some description')
    expect(operation['x-custom-key']).toEqual(20)
  })

  it('merges and applies consecutive @OpenAPI object and function parameters top-down', () => {
    const operation = getOperation(routes[4])
    expect(operation.summary).toEqual('Some summary')
    expect(operation.description).toEqual('Some description')
    expect(operation['x-custom-key']).toEqual(20)
  })

  it('applies @ResponseSchema using default contentType and statusCode', () => {
    const operation = getOperation(routes[5])
    expect(operation.responses['200'].content['application/json']).toEqual({"schema": {"$ref": "#/components/schemas/ModelDto"}})
  })

  it('applies @ResponseSchema using contentType and statusCode from options object', () => {
    const operation = getOperation(routes[6])
    expect(operation.responses['400'].content['text/csv']).toEqual({"schema": {"$ref": "#/components/schemas/ModelDto"}})
  })

  it('applies @ResponseSchema using contentType and statusCode from decorators', () => {
    const operation = getOperation(routes[7])
    expect(operation.responses['201'].content['application/pdf']).toEqual({"schema": {"$ref": "#/components/schemas/ModelDto"}})
  })
})