import {
  Get,
  getMetadataArgsStorage,
  JsonController,
  Param
} from 'routing-controllers'

import { getOperation, getTags, IRoute, OpenAPI, parseRoutes } from '../src'

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
})
