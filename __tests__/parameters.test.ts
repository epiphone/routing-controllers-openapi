import * as _ from 'lodash'
import {
  Get,
  getMetadataArgsStorage,
  JsonController,
  Param,
  QueryParam,
  QueryParams
} from 'routing-controllers'

import { getPathParams, getQueryParams, IRoute, parseRoutes } from '../src'

describe('parameters', () => {
  let route: IRoute

  beforeAll(() => {
    getMetadataArgsStorage().reset()

    class ListUsersQueryParams {}

    @JsonController('/users')
    // @ts-ignore: not referenced
    class UsersController {
      @Get('/:userId')
      getPost(
        @Param('userId') _userId: number,
        @Param('invalidParam') _invalidParam: string,
        @QueryParam('limit') _limit: number,
        @QueryParams() _queryRef?: ListUsersQueryParams
      ) {
        return
      }
    }

    route = parseRoutes(getMetadataArgsStorage())[0]
  })

  it('parses path parameter from path strings', () => {
    expect(getPathParams({ ...route, params: [] })).toEqual([
      {
        in: 'path',
        name: 'userId',
        required: true,
        schema: { type: 'string' }
      }
    ])
  })

  it('supplements path parameter with @Param decorator', () => {
    expect(getPathParams(route)).toEqual([
      {
        in: 'path',
        name: 'userId',
        required: true,
        schema: { type: 'number' }
      }
    ])
  })

  it('ignores @Param if corresponding name is not found in path string', () => {
    expect(_.filter(getPathParams(route), { name: 'invalidParam' })).toEqual([])
  })

  it('parses query param from @QueryParam decorator', () => {
    expect(getQueryParams(route)[0]).toEqual({
      in: 'query',
      name: 'limit',
      required: false,
      schema: { type: 'number' }
    })
  })

  it('parses query param ref from @QueryParams decorator', () => {
    expect(getQueryParams(route)[1]).toEqual({
      in: 'query',
      name: 'ListUsersQueryParams',
      required: false,
      schema: { $ref: '#/components/schemas/ListUsersQueryParams' }
    })
  })
})
