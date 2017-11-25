import { IsString } from 'class-validator'
import {
  Body,
  Get,
  getMetadataArgsStorage,
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
    return
  }

  @Get('/:from-:to')
  listUsersInRange(@Param('to') _to: number) {
    return
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
    @Body({ required: true })
    _body: CreatePostBody
  ) {
    return
  }
}

@JsonController('/users/:userId/posts')
class UserPostsController {
  @Get('/:postId')
  getUserPost(
    @Param('userId') _userId: number,
    @Param('postId') _postId: string
  ) {
    return
  }
}

const spec = routingControllersToSpec(
  getMetadataArgsStorage(),
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
                name: 'ListUsersQueryParams',
                required: false,
                schema: {
                  $ref: '#/components/schemas/ListUsersQueryParams'
                }
              }
            ],
            responses: {
              '200': {
                content: { 'application/json': {} },
                description: 'Successful response'
              }
            },
            summary: 'List users',
            tags: ['Users']
          },
          post: {
            operationId: 'UsersController.createUser',
            requestBody: {
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CreateUserBody' }
                }
              },
              description: 'CreateUserBody',
              required: false
            },
            responses: {
              '201': {
                content: { 'application/json': {} },
                description: 'Successful response'
              }
            },
            summary: 'Create user',
            tags: ['Users']
          }
        },
        '/api/users/{from}-{to}': {
          get: {
            operationId: 'UsersController.listUsersInRange',
            parameters: [
              {
                in: 'path',
                name: 'from',
                required: true,
                schema: { type: 'string' }
              },
              {
                in: 'path',
                name: 'to',
                required: true,
                schema: { type: 'number' }
              }
            ],
            responses: {
              '200': {
                content: { 'application/json': {} },
                description: 'Successful response'
              }
            },
            summary: 'List users in range',
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
                description: 'Successful response'
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
            requestBody: {
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CreatePostBody' }
                }
              },
              description: 'CreatePostBody',
              required: true
            },
            responses: {
              '200': {
                content: { 'application/json': {} },
                description: 'Successful response'
              }
            },
            summary: 'Create user post',
            tags: ['Users']
          }
        },
        '/api/users/{userId}/posts/{postId}': {
          get: {
            operationId: 'UserPostsController.getUserPost',
            parameters: [
              {
                in: 'path',
                name: 'userId',
                required: true,
                schema: { type: 'number' }
              },
              {
                in: 'path',
                name: 'postId',
                required: true,
                schema: { type: 'string' }
              }
            ],
            responses: {
              '200': {
                content: { 'application/json': {} },
                description: 'Successful response'
              }
            },
            summary: 'Get user post',
            tags: ['User Posts']
          }
        }
      }
    })
  })
})
