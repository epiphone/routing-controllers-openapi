import {
  Get,
  getMetadataArgsStorage,
  JsonController,
  Param
} from 'routing-controllers'

import { getOperation, getTags, IRoute, OpenAPI, parseRoutes } from '../src'

describe('options', () => {
  let routes: IRoute[]

  beforeEach(() => {
    getMetadataArgsStorage().reset()

    // @ts-ignore: not referenced
    @JsonController('/users')
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
})
