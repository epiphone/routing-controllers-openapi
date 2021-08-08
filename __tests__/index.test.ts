// tslint:disable:no-implicit-dependencies no-submodule-imports
const { defaultMetadataStorage } = require('class-transformer/cjs/storage')
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import _merge from 'lodash.merge'
import { getMetadataArgsStorage } from 'routing-controllers'

import {
  expressToOpenAPIPath,
  getFullPath,
  getOperationId,
  parseRoutes,
  routingControllersToSpec,
} from '../src'
import { getRequestBody } from '../src/generateSpec'
import {
  RootController,
  UserPostsController,
  UsersController,
} from './fixtures/controllers'

// Construct OpenAPI spec:
const storage = getMetadataArgsStorage()
const options = {
  controllers: [UsersController, UserPostsController],
  routePrefix: '/api',
}
const routes = parseRoutes(storage, options)

describe('index', () => {
  it('generates an OpenAPI spec from routing-controllers metadata', () => {
    // Include component schemas parsed with class-validator-jsonschema:
    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    })

    const spec = routingControllersToSpec(storage, options, {
      components: {
        schemas,
        securitySchemes: {
          basicAuth: {
            scheme: 'basic',
            type: 'http',
          },
          bearerAuth: {
            scheme: 'bearer',
            type: 'http',
          },
        },
      },
      info: { title: 'My app', version: '1.2.0' },
    })
    expect(spec).toEqual(require('./fixtures/spec.json'))
  })

  it('parses actions in declared order from controller metadata', () => {
    const actions = routes.map((d) => d.action)
    expect(actions).toEqual([
      {
        method: 'listUsers',
        route: '/',
        target: UsersController,
        type: 'get',
      },
      {
        method: 'listUsersInRange',
        route: '/:from-:to',
        target: UsersController,
        type: 'get',
      },
      {
        method: 'getUser',
        route: '/:userId?',
        target: UsersController,
        type: 'get',
      },
      {
        method: 'createUser',
        route: '/',
        target: UsersController,
        type: 'post',
      },
      {
        method: 'createUserWithType',
        route: '/withType',
        target: UsersController,
        type: 'post',
      },
      {
        method: 'createManyUsers',
        route: '/',
        target: UsersController,
        type: 'put',
      },
      {
        method: 'createNestedUsers',
        route: '/nested',
        target: UsersController,
        type: 'post',
      },
      {
        method: 'createUserPost',
        route: '/:userId/posts',
        target: UsersController,
        type: 'post',
      },
      {
        method: 'deleteUsersByVersion',
        route: '/:version(v?\\d{1}|all)',
        target: UsersController,
        type: 'delete',
      },
      {
        method: 'putUserDefault',
        route: undefined,
        target: UsersController,
        type: 'put',
      },
      {
        method: 'putUserAvatar',
        route: '/:userId/avatar',
        target: UsersController,
        type: 'put',
      },
      {
        method: 'getUserPost',
        route: '/:postId',
        target: UserPostsController,
        type: 'get',
      },
      {
        method: 'patchUserPost',
        route: '/:postId',
        target: UserPostsController,
        type: 'patch',
      },
      {
        method: 'createUserPostImages',
        route: '/:postId/images',
        target: UserPostsController,
        type: 'post',
      },
      {
        method: 'getDefaultPath',
        route: undefined,
        target: RootController,
        type: 'get',
      },
      {
        method: 'getStringPath',
        route: '/stringPath',
        target: RootController,
        type: 'get',
      },
    ])
  })

  it('gets full OpenAPI-formatted paths', () => {
    const route = _merge({}, routes[0])
    expect(getFullPath(route)).toEqual('/api/users/')

    route.options.routePrefix = undefined
    expect(getFullPath(route)).toEqual('/users/')

    route.controller.route = ''
    expect(getFullPath(route)).toEqual('/')

    route.action.route = '/all'
    expect(getFullPath(route)).toEqual('/all')
  })

  it('converts Express paths into OpenAPI paths', () => {
    expect(expressToOpenAPIPath('')).toEqual('')
    expect(expressToOpenAPIPath('/')).toEqual('/')
    expect(expressToOpenAPIPath('123')).toEqual('123')
    expect(expressToOpenAPIPath('/users')).toEqual('/users')
    expect(expressToOpenAPIPath('/users/:userId')).toEqual('/users/{userId}')
    expect(expressToOpenAPIPath('/users/:userId/:from-:to')).toEqual(
      '/users/{userId}/{from}-{to}'
    )
    expect(expressToOpenAPIPath('/users/:userId/:limit?')).toEqual(
      '/users/{userId}/{limit}'
    )
    expect(expressToOpenAPIPath('/users/:userId(\\d+)')).toEqual(
      '/users/{userId}'
    )
    expect(expressToOpenAPIPath('/users/:type(user|admin)')).toEqual(
      '/users/{type}'
    )
  })

  it('gets OpenAPI Operation IDs', () => {
    const route = _merge({}, routes[0])
    expect(getOperationId(route)).toEqual('UsersController.listUsers')

    route.action.target = class AnotherController {}
    route.action.method = 'anotherMethod'
    expect(getOperationId(route)).toEqual('AnotherController.anotherMethod')
  })
})

describe('getRequestBody', () => {
  it('parse a single `body` metadata item into a single `object` schema', () => {
    const route = routes.find((d) => d.action.method === 'createUser')!
    expect(route).toBeDefined()
    expect(getRequestBody(route)).toEqual({
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/CreateUserBody',
          },
        },
      },
      description: 'CreateUserBody',
      required: false,
    })
  })

  it('parse a single `body` metadata item of array type into a single `object` schema', () => {
    const route = routes.find((d) => d.action.method === 'createManyUsers')!
    expect(route).toBeDefined()
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
      required: true,
    })
  })

  it('parse a single `body-param` metadata item into a single `object` schema', () => {
    const route = routes.find((d) => d.action.method === 'patchUserPost')!
    expect(route).toBeDefined()
    expect(getRequestBody(route)).toEqual({
      content: {
        'application/json': {
          schema: {
            properties: {
              token: {
                type: 'string',
              },
            },
            required: [],
            type: 'object',
          },
        },
      },
    })
  })

  it('combine multiple `body-param` metadata items into a single `object` schema', () => {
    const route = routes.find((d) => d.action.method === 'putUserDefault')!
    expect(route).toBeDefined()
    expect(getRequestBody(route)).toEqual({
      content: {
        'application/json': {
          schema: {
            properties: {
              limit: {
                type: 'number',
              },
              query: {
                $ref: '#/components/schemas/UserQuery',
              },
              token: {
                type: 'string',
              },
            },
            required: ['token'],
            type: 'object',
          },
        },
      },
    })
  })

  it('wrap `body` and `body-param` metadata items under a single `allOf` schema', () => {
    const route = routes.find((d) => d.action.method === 'createUserPost')!
    expect(route).toBeDefined()
    expect(getRequestBody(route)).toEqual({
      content: {
        'application/json': {
          schema: {
            allOf: [
              {
                $ref: '#/components/schemas/CreatePostBody',
              },
              {
                properties: {
                  token: {
                    type: 'string',
                  },
                },
                required: [],
                type: 'object',
              },
            ],
          },
        },
      },
      description: 'CreatePostBody',
      required: true,
    })
  })

  it('parse a single `UploadedFile` metadata into a single `object` schema under content-type `multipart/form-data`', () => {
    const route = routes.find((d) => d.action.method === 'putUserAvatar')!
    expect(route).toBeDefined()
    expect(getRequestBody(route)).toEqual({
      content: {
        'multipart/form-data': {
          schema: {
            properties: {
              image: {
                format: 'binary',
                type: 'string',
              },
            },
            required: [],
            type: 'object',
          },
        },
      },
    })
  })
  it('wrap `body` and others metadata containing `UploadedFiles` items under a single `allOf` schema under content-type `multipart/form-data`', () => {
    const route = routes.find(
      (d) => d.action.method === 'createUserPostImages'
    )!
    expect(route).toBeDefined()
    expect(getRequestBody(route)).toEqual({
      content: {
        'multipart/form-data': {
          schema: {
            allOf: [
              {
                $ref: '#/components/schemas/CreateUserPostImagesBody',
              },
              {
                properties: {
                  images: {
                    items: {
                      format: 'binary',
                      type: 'string',
                    },
                    type: 'array',
                  },
                  token: {
                    type: 'string',
                  },
                },
                required: [],
                type: 'object',
              },
            ],
          },
        },
      },
      description: 'CreateUserPostImagesBody',
      required: true,
    })
  })
})
