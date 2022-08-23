import {
  Get,
  getMetadataArgsStorage,
  HeaderParam,
  HeaderParams,
  JsonController,
  Param,
  Params,
  QueryParam,
  QueryParams,
} from 'routing-controllers'

import {
  getHeaderParams,
  getPathParams,
  getQueryParams,
  IRoute,
  parseRoutes,
} from '../src'
import { SchemaObject } from 'openapi3-ts'
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'
const { defaultMetadataStorage } = require('class-transformer/cjs/storage')

describe('parameters', () => {
  let routes: IRoute[]
  let schemas: { [p: string]: SchemaObject }

  beforeAll(() => {
    class ListUsersHeaderParams {}

    class ListUsersQueryParams {
      @IsNumber()
      genderId: number

      @IsBoolean()
      @IsOptional()
      isPretty: boolean

      @IsString({ each: true })
      types: string[]
    }

    class ListPostsPathParams {
      @IsString()
      string: string

      @IsNumber()
      number: number

      @IsBoolean()
      boolean: boolean
    }

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

      @Get('/:string/:number/:boolean')
      getPosts(
        @Params() _params: ListPostsPathParams,
      ) {
        return
      }
    }

    routes = parseRoutes(getMetadataArgsStorage())
    schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    })
  })

  it('parses path parameter from path strings', () => {
    expect(getPathParams({ ...routes[0], params: [] }, schemas)).toEqual([
      {
        in: 'path',
        name: 'string',
        required: true,
        schema: { type: 'string' },
      },
      {
        in: 'path',
        name: 'regex',
        required: true,
        schema: { pattern: '\\d{6}', type: 'string' },
      },
      {
        in: 'path',
        name: 'optional',
        required: false,
        schema: { type: 'string' },
      },
      {
        in: 'path',
        name: 'number',
        required: true,
        schema: { type: 'string' },
      },
      {
        in: 'path',
        name: 'boolean',
        required: true,
        schema: { type: 'string' },
      },
      {
        in: 'path',
        name: 'any',
        required: true,
        schema: { type: 'string' },
      },
    ])
  })

  it('supplements path parameter with @Param decorator', () => {
    expect(getPathParams(routes[0], schemas)).toEqual([
      {
        in: 'path',
        name: 'string',
        required: true,
        schema: { type: 'string' },
      },
      {
        in: 'path',
        name: 'regex',
        required: true,
        schema: { pattern: '\\d{6}', type: 'string' },
      },
      {
        in: 'path',
        name: 'optional',
        required: false,
        schema: { type: 'string' },
      },
      {
        in: 'path',
        name: 'number',
        required: true,
        schema: { type: 'number' },
      },
      {
        in: 'path',
        name: 'boolean',
        required: true,
        schema: { type: 'boolean' },
      },
      {
        in: 'path',
        name: 'any',
        required: true,
        schema: {},
      },
    ])
  })

  it('supplements path parameters with schemas from the @Params decorator', () => {
    expect(getPathParams(routes[1], schemas)).toEqual([
      {
        in: 'path',
        name: 'string',
        required: true,
        schema: { type: 'string' },
      },
      {
        in: 'path',
        name: 'number',
        required: true,
        schema: { type: 'number' },
      },
      {
        in: 'path',
        name: 'boolean',
        required: true,
        schema: { type: 'boolean' },
      },
    ])
  })

  it('ignores @Param if corresponding name is not found in path string', () => {
    expect(getPathParams(routes[0], schemas).filter((r) => r.name === 'invalid')).toEqual([])
  })

  it('parses query param from @QueryParam decorator', () => {
    expect(getQueryParams(routes[0], schemas)[0]).toEqual({
      in: 'query',
      name: 'limit',
      required: false,
      schema: { type: 'number' },
    })
  })

  it('parses query param ref from @QueryParams decorator', () => {
    expect(getQueryParams(routes[0], schemas)).toEqual([
      // limit comes from @QueryParam
      {
        in: 'query',
        name: 'limit',
        required: false,
        schema: { type: 'number' },
      },
      {
        in: 'query',
        name: 'genderId',
        required: true,
        schema: { type: 'number' },
      },
      {
        in: 'query',
        name: 'isPretty',
        required: false,
        schema: {
          type: 'boolean',
        },
      },
      {
        in: 'query',
        name: 'types',
        required: true,
        schema: {
          items: {
            type: 'string',
          },
          type: 'array',
        },
      },
    ])
  })

  it('parses header param from @HeaderParam decorator', () => {
    expect(getHeaderParams(routes[0])[0]).toEqual({
      in: 'header',
      name: 'Authorization',
      required: true,
      schema: { type: 'string' },
    })
  })

  it('parses header param ref from @HeaderParams decorator', () => {
    expect(getHeaderParams(routes[0])[1]).toEqual({
      in: 'header',
      name: 'ListUsersHeaderParams',
      required: false,
      schema: { $ref: '#/components/schemas/ListUsersHeaderParams' },
    })
  })
})
