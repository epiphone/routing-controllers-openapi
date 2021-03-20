import {
  Body,
  getMetadataArgsStorage,
  JsonController,
  Post,
  QueryParam,
} from 'routing-controllers'

import {
  getPathParams,
  getQueryParams,
  getRequestBody,
  IRoute,
  parseRoutes,
} from '../src'

describe('options', () => {
  let routes: IRoute[]

  beforeEach(() => {
    getMetadataArgsStorage().reset()

    class CreateUserBody {}
    class ParamType {}

    @JsonController('/users')
    // @ts-ignore: not referenced
    class UsersController {
      @Post('/:userId')
      createUser(
        @QueryParam('from') _from: number,
        @QueryParam('to', { required: false }) _to: number,
        @Body({ type: CreateUserBody }) _body: CreateUserBody[]
      ) {
        return
      }

      @Post('/:userId')
      createManyUsers(
        @QueryParam('param', { type: ParamType }) _param: string,
        @Body() _body: CreateUserBody[]
      ) {
        return
      }
    }

    routes = parseRoutes(getMetadataArgsStorage())
  })

  it('sets path parameter always as required regardless of options', () => {
    const route = routes[0]
    expect(getPathParams(route)[0].required).toEqual(true)

    route.options.defaults = { paramOptions: { required: false } }
    expect(getPathParams(route)[0].required).toEqual(true)
  })

  it('sets query parameter optional by default', () => {
    const route = routes[0]
    expect(getQueryParams(route, {})[0].required).toEqual(false)
  })

  it('sets query parameter required as per global options', () => {
    const route = routes[0]
    route.options.defaults = { paramOptions: { required: true } }
    expect(getQueryParams(route, {})[0].required).toEqual(true)
  })

  it('uses local required option over the global one', () => {
    const route = routes[0]
    route.options.defaults = { paramOptions: { required: true } }
    expect(getQueryParams(route, {})[1].required).toEqual(false)
  })

  it('uses the explicit `type` parameter to override request query type', () => {
    const route = routes[1]
    expect(getQueryParams(route, {})[0]).toEqual({
      in: 'query',
      name: 'param',
      required: false,
      schema: {
        $ref: '#/components/schemas/ParamType',
      },
    })
  })

  it('uses the explicit `type` parameter to override array request body item type', () => {
    const route = routes[0]
    expect(getRequestBody(route)).toEqual({
      content: {
        'application/json': {
          schema: {
            items: {
              $ref: '#/components/schemas/CreateUserBody',
            },
            type: 'array',
          },
        },
      },
      description: 'CreateUserBody',
      required: false,
    })
  })

  it('set inner schema as {} if array request body item type is not explicitly defined', () => {
    const route = routes[1]
    expect(getRequestBody(route)).toEqual({
      content: {
        'application/json': {
          schema: {
            items: {
              type: 'object',
            },
            type: 'array',
          },
        },
      },
      description: '',
      required: false,
    })
  })
})
