import { IsString } from 'class-validator'
import {
  Body,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  QueryParams
} from 'routing-controllers'

import { routingControllersToSpec } from '../../src'

class CreateUserBody {
  email: string
}

class CreatePostBody {
  @IsString({ each: true })
  content: string
}

class ListUsersQueryParams {
  types: string[]
}

@JsonController('/users')
class UsersController {
  @Get('/')
  listUsers(@QueryParams() _query?: ListUsersQueryParams) {
    return [1, 2]
  }

  @Get('/:userId')
  getUser(@Param('userId') _userId: number) {
    return
  }

  @HttpCode(201)
  @Post('/')
  createUser(@Body() _body: CreateUserBody) {
    return
  }

  @Post('/:userId/posts')
  createUserPost(
    @Param('userId') _userId: number,
    @Body({ required: false })
    _body: CreatePostBody
  ) {
    return
  }
}

const spec = routingControllersToSpec(
  undefined,
  { routePrefix: '/api' },
  {
    title: 'My app',
    version: '1.2.0'
  }
)

describe('routingControllersConverter', () => {
  it('generates an OpenAPI spec from routing-controllers metadata', () => {
    expect(spec).toEqual({
      components: { schemas: {} },
      info: { title: 'My app', version: '1.2.0' },
      openapi: '3.0.0',
      paths: {
        '/api/users/': {
          get: {
            operationId: 'UsersController.listUsers',
            parameters: [
              {
                in: 'query',
                name: 'types',
                required: false,
                schema: {
                  items: { type: 'string' },
                  type: 'array'
                }
              }
            ],
            responses: {
              '200': {
                content: { 'application/json': {} },
                description: expect.any(String) // TODO read description
              }
            },
            summary: 'List users',
            tags: ['Users']
          },
          post: {
            operationId: 'UsersController.createUser',
            responses: {
              '201': {
                content: { 'application/json': {} },
                description: expect.any(String) // TODO read description
              }
            },
            summary: 'Create users',
            tags: ['Users']
          }
        },
        '/api/users/{userId}': {
          get: {
            operationId: 'UsersController.getUser',
            parameters: [
              {
                in: 'path',
                name: 'userId',
                required: true,
                schema: { type: 'number' }
              }
            ],
            responses: {
              '200': {
                content: { 'application/json': {} },
                description: expect.any(String) // TODO read description
              }
            },
            summary: 'Get user',
            tags: ['Users']
          }
        },
        '/api/users/{userId}/posts': {
          post: {
            operationId: 'UsersController.createUserPost',
            parameters: [
              {
                in: 'path',
                name: 'userId',
                required: true,
                schema: { type: 'string' }
              }
            ],
            responses: {
              '200': {
                content: { 'application/json': {} },
                description: expect.any(String) // TODO read description
              }
            },
            summary: 'Create user post',
            tags: ['Users']
          }
        }
      }
    })
  })
})
