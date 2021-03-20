import { ResponsesObject } from 'openapi3-ts'
import {
  ContentType,
  Controller,
  Get,
  getMetadataArgsStorage,
  HttpCode,
  JsonController,
} from 'routing-controllers'

import { getResponses, parseRoutes } from '../src'

describe('responses', () => {
  let responses: ResponsesObject[]

  beforeEach(() => {
    getMetadataArgsStorage().reset()

    @Controller('/default-controller')
    // @ts-ignore: not referenced
    class DefaultController {
      @Get('/')
      getDefault() {
        return
      }

      @Get('/')
      @ContentType('text/cvs')
      @HttpCode(201)
      getCVS() {
        return
      }
    }

    @JsonController('/json-controller')
    // @ts-ignore: not referenced
    class JSONController {
      @Get('/')
      getDefault() {
        return
      }

      @Get('/')
      @ContentType('text/plain')
      @HttpCode(204)
      getPlain() {
        return
      }
    }

    responses = parseRoutes(getMetadataArgsStorage()).map(getResponses)
  })

  it('sets success status code to 200 by default', () => {
    expect(responses[0]).toMatchObject({ '200': expect.any(Object) })
    expect(responses[2]).toMatchObject({ '200': expect.any(Object) })
  })

  it('overrides success status code as per @HttpCode decorator', () => {
    expect(responses[1]).toMatchObject({ '201': expect.any(Object) })
    expect(responses[3]).toMatchObject({ '204': expect.any(Object) })
  })

  it('sets default content type as per controller class type', () => {
    expect(responses[0]).toMatchObject({
      '200': {
        content: { 'text/html; charset=utf-8': {} },
      },
    })
    expect(responses[2]).toMatchObject({
      '200': {
        content: { 'application/json': {} },
      },
    })
  })

  it('overrides content type as per @ContentType decorator', () => {
    expect(responses[1]).toMatchObject({
      '201': {
        content: { 'text/cvs': {} },
      },
    })
    expect(responses[3]).toMatchObject({
      '204': {
        content: { 'text/plain': {} },
      },
    })
  })
})
