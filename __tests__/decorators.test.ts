import {
  Get,
  getMetadataArgsStorage,
  JsonController,
  Param
} from 'routing-controllers'
import { ModelDto } from './fixtures/models'
import { getOperation, getTags, IRoute, OpenAPI, ResponseBody, parseRoutes } from '../src'

describe('options', () => {
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

      @Get('/model/:uuid')
      @ResponseBody(ModelDto, 200)
      getModel(@Param('userId') _userId: number) {
        return new ModelDto();
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

  it('applies @ResponseBody decorator function parameter to operation', () => {
    const operation = getOperation(routes[2])
    expect(operation.responses['200']['application/json']).toEqual(require('./fixtures/responseBodySchema.json'))
  })
})
