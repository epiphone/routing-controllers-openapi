import {
  Get,
  getMetadataArgsStorage,
  HeaderParam,
  HeaderParams,
  JsonController,
  Param,
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
  let route: IRoute
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
    schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    })
  })

  it('parses path parameter from path strings', () => {
    expect(getPathParams({ ...route, params: [] })).toEqual([
      {
        in: 'path',
        name: 'string',
        required: true,
        schema: { pattern: '[^\\/#\\?]+?', type: 'string' },
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
        schema: { pattern: '[^\\/#\\?]+?', type: 'string' },
      },
      {
        in: 'path',
        name: 'number',
        required: true,
        schema: { pattern: '[^\\/#\\?]+?', type: 'string' },
      },
      {
        in: 'path',
        name: 'boolean',
        required: true,
        schema: { pattern: '[^\\/#\\?]+?', type: 'string' },
      },
      {
        in: 'path',
        name: 'any',
        required: true,
        schema: { pattern: '[^\\/#\\?]+?', type: 'string' },
      },
    ])
  })

  it('supplements path parameter with @Param decorator', () => {
    expect(getPathParams(route)).toEqual([
      {
        in: 'path',
        name: 'string',
        required: true,
        schema: { pattern: '[^\\/#\\?]+?', type: 'string' },
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
        schema: { pattern: '[^\\/#\\?]+?', type: 'string' },
      },
      {
        in: 'path',
        name: 'number',
        required: true,
        schema: { pattern: '[^\\/#\\?]+?', type: 'number' },
      },
      {
        in: 'path',
        name: 'boolean',
        required: true,
        schema: { pattern: '[^\\/#\\?]+?', type: 'boolean' },
      },
      {
        in: 'path',
        name: 'any',
        required: true,
        schema: {},
      },
    ])
  })

  it('ignores @Param if corresponding name is not found in path string', () => {
    expect(getPathParams(route).filter((r) => r.name === 'invalid')).toEqual([])
  })

  it('parses query param from @QueryParam decorator', () => {
    expect(getQueryParams(route, schemas)[0]).toEqual({
      in: 'query',
      name: 'limit',
      required: false,
      schema: { type: 'number' },
    })
  })

  it('parses query param ref from @QueryParams decorator', () => {
    expect(getQueryParams(route, schemas)).toEqual([
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
    expect(getHeaderParams(route)[0]).toEqual({
      in: 'header',
      name: 'Authorization',
      required: true,
      schema: { type: 'string' },
    })
  })

  it('parses header param ref from @HeaderParams decorator', () => {
    expect(getHeaderParams(route)[1]).toEqual({
      in: 'header',
      name: 'ListUsersHeaderParams',
      required: false,
      schema: { $ref: '#/components/schemas/ListUsersHeaderParams' },
    })
  })
})
