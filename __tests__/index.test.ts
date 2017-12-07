// tslint:disable:no-implicit-dependencies
import { getFromContainer, MetadataStorage } from 'class-validator'
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import * as _ from 'lodash'
import { getMetadataArgsStorage } from 'routing-controllers'

import {
  expressToOpenAPIPath,
  getFullPath,
  getOperationId,
  parseRoutes,
  routingControllersToSpec
} from '../src'
import { UserPostsController, UsersController } from './fixtures/controllers'

// Construct OpenAPI spec:
const storage = getMetadataArgsStorage()
const options = {
  controllers: [UsersController, UserPostsController],
  routePrefix: '/api'
}
const routes = parseRoutes(storage, options)

describe('index', () => {
  it('generates an OpenAPI spec from routing-controllers metadata', () => {
    // Include component schemas parsed with class-validator-jsonschema:
    const metadatas = (getFromContainer(MetadataStorage) as any)
      .validationMetadatas
    const schemas = validationMetadatasToSchemas(metadatas, {
      refPointerPrefix: '#/components/schemas'
    })

    const spec = routingControllersToSpec(storage, options, {
      components: { schemas },
      info: { title: 'My app', version: '1.2.0' }
    })
    expect(spec).toEqual(require('./fixtures/spec.json'))
  })

  it('parses actions in declared order from controller metadata', () => {
    const actions = routes.map(d => d.action)
    expect(actions).toEqual([
      {
        method: 'listUsers',
        route: '/',
        target: UsersController,
        type: 'get'
      },
      {
        method: 'listUsersInRange',
        route: '/:from-:to',
        target: UsersController,
        type: 'get'
      },
      {
        method: 'getUser',
        route: '/:userId?',
        target: UsersController,
        type: 'get'
      },
      {
        method: 'createUser',
        route: '/',
        target: UsersController,
        type: 'post'
      },
      {
        method: 'createUserPost',
        route: '/:userId/posts',
        target: UsersController,
        type: 'post'
      },
      {
        method: 'deleteUsersByVersion',
        route: '/:version(v?\\d{1}|all)',
        target: UsersController,
        type: 'delete'
      },
      {
        method: 'getUserPost',
        route: '/:postId',
        target: UserPostsController,
        type: 'get'
      }
    ])
  })

  it('gets full OpenAPI-formatted paths', () => {
    const route = _.cloneDeep(routes[0])
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
    const route = _.cloneDeep(routes[0])
    expect(getOperationId(route)).toEqual('UsersController.listUsers')

    route.action.target = class AnotherController {}
    route.action.method = 'anotherMethod'
    expect(getOperationId(route)).toEqual('AnotherController.anotherMethod')
  })
})
