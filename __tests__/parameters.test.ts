import * as _ from 'lodash'
import {
  Get,
  getMetadataArgsStorage,
  HeaderParam,
  HeaderParams,
  JsonController,
  Param,
  QueryParam,
  QueryParams
} from 'routing-controllers'

import {
  getHeaderParams,
  getPathParams,
  getQueryParams,
  IRoute,
  parseRoutes
} from '../src'

describe('parameters', () => {
  let route: IRoute

  beforeAll(() => {
    class ListUsersHeaderParams {}
    class ListUsersQueryParams {}

    @JsonController('/users')
    // @ts-ignore: not referenced
    class UsersController {
      @Get('/:string/:regex(\\d{6})/:optional?/:number/:boolean/:any')
      getPost(
        @Param('number') _numberParam: number,
        @Param('invalid') _invalidParam: string,
        @Param('boolean') _booleanParam: boolean,
        @Param('any') _anyParam: any,
        @QueryParam('limit') _limit: number,
        @HeaderParam('Authorization', { required: true })
        _authorization: string,
        @QueryParams() _queryRef?: ListUsersQueryParams,
        @HeaderParams() _headerParams?: ListUsersHeaderParams
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
        name: 'string',
        required: true,
        schema: { type: 'string' }
      },
      {
        in: 'path',
        name: 'regex',
        required: true,
        schema: { pattern: '\\d{6}', type: 'string' }
      },
      {
        in: 'path',
        name: 'optional',
        required: false,
        schema: { type: 'string' }
      },
      {
        in: 'path',
        name: 'number',
        required: true,
        schema: { type: 'string' }
      },
      {
        in: 'path',
        name: 'boolean',
        required: true,
        schema: { type: 'string' }
      },
      {
        in: 'path',
        name: 'any',
        required: true,
        schema: { type: 'string' }
      }
    ])
  })

  it('supplements path parameter with @Param decorator', () => {
    expect(getPathParams(route)).toEqual([
      {
        in: 'path',
        name: 'string',
        required: true,
        schema: { type: 'string' }
      },
      {
        in: 'path',
        name: 'regex',
        required: true,
        schema: { pattern: '\\d{6}', type: 'string' }
      },
      {
        in: 'path',
        name: 'optional',
        required: false,
        schema: { type: 'string' }
      },
      {
        in: 'path',
        name: 'number',
        required: true,
        schema: { type: 'number' }
      },
      {
        in: 'path',
        name: 'boolean',
        required: true,
        schema: { type: 'boolean' }
      },
      {
        in: 'path',
        name: 'any',
        required: true,
        schema: {}
      }
    ])
  })

  it('ignores @Param if corresponding name is not found in path string', () => {
    expect(_.filter(getPathParams(route), { name: 'invalid' })).toEqual([])
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

  it('parses header param from @HeaderParam decorator', () => {
    expect(getHeaderParams(route)[0]).toEqual({
      in: 'header',
      name: 'Authorization',
      required: true,
      schema: { type: 'string' }
    })
  })

  it('parses header param ref from @HeaderParams decorator', () => {
    expect(getHeaderParams(route)[1]).toEqual({
      in: 'header',
      name: 'ListUsersHeaderParams',
      required: false,
      schema: { $ref: '#/components/schemas/ListUsersHeaderParams' }
    })
  })
})
