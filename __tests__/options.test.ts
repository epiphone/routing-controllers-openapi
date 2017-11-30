import {
  Body,
  getMetadataArgsStorage,
  JsonController,
  Post,
  QueryParam
} from 'routing-controllers'

import { getPathParams, getQueryParams, IRoute, parseRoutes } from '../src'

describe('options', () => {
  let route: IRoute

  beforeEach(() => {
    getMetadataArgsStorage().reset()

    class CreateUserBody {}

    @JsonController('/users')
    // @ts-ignore: not referenced
    class UsersController {
      @Post('/:userId')
      createUser(
        @QueryParam('from') _from: number,
        @QueryParam('to', { required: false })
        _to: number,
        @Body() _body: CreateUserBody
      ) {
        return
      }
    }

    route = parseRoutes(getMetadataArgsStorage())[0]
  })

  it('sets path parameter always as required regardless of options', () => {
    expect(getPathParams(route)[0].required).toEqual(true)

    route.options.defaults = { paramOptions: { required: false } }
    expect(getPathParams(route)[0].required).toEqual(true)
  })

  it('sets query parameter optional by default', () => {
    expect(getQueryParams(route)[0].required).toEqual(false)
  })

  it('sets query parameter required as per global options', () => {
    route.options.defaults = { paramOptions: { required: true } }
    expect(getQueryParams(route)[0].required).toEqual(true)
  })

  it('uses local required option over the global one', () => {
    route.options.defaults = { paramOptions: { required: true } }
    expect(getQueryParams(route)[1].required).toEqual(false)
  })
})
