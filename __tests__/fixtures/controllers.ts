// tslint:disable:no-implicit-dependencies
import { IsEmail, IsOptional, IsString } from 'class-validator'
import {
  Body,
  ContentType,
  Controller,
  Delete,
  Get,
  HeaderParam,
  HeaderParams,
  HttpCode,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
  QueryParams
} from 'routing-controllers'

import { OpenAPI, ResponseSchema } from '../../src'
import { ModelDto } from './models'

export class CreateUserBody {
  @IsEmail()
  email: string
}

export class CreatePostBody {
  @IsString({ each: true })
  content: string[]
}

export class ListUsersQueryParams {
  @IsOptional()
  @IsEmail()
  email?: string

  @IsString({ each: true })
  types: string[]
}

export class ListUsersHeaderParams {
  @IsString()
  Authorization: string

  @IsOptional()
  @IsString()
  'X-Correlation-ID': string
}

@JsonController('/users')
export class UsersController {
  @Get('/')
  @ContentType('text/cvs')
  @OpenAPI({ description: 'List all users' })
  @ResponseSchema(ModelDto, { isArray: true })
  listUsers(
    @QueryParams() _query?: ListUsersQueryParams,
    @HeaderParams() _header?: ListUsersHeaderParams
  ) {
    return
  }

  @Get('/:from-:to')
  @OpenAPI({ responses: { '400': { description: 'Bad request' } } })
  listUsersInRange(
    @Param('to') _to: number,
    @QueryParam('') _emptyQuery: string,
    @QueryParam('userId', { required: true }) _userId: number
  ) {
    return
  }

  @Get('/:userId?')
  getUser(
    @Param('userId') _userId: number,
    @HeaderParam('') _emptyHeader: string,
    @HeaderParam('X-Requested-With') _xRequestedWith: string
  ) {
    return
  }

  @HttpCode(201)
  @Post('/')
  @ResponseSchema(ModelDto, {
    description: 'Created user object',
    statusCode: 201
  })
  createUser(@Body() _body: CreateUserBody) {
    return
  }

  @Put('/')
  createManyUsers(
    @Body({ required: true, type: CreateUserBody }) _body: CreateUserBody[]
  ) {
    return
  }

  @Post('/:userId/posts')
  createUserPost(@Body({ required: true }) _body: CreatePostBody) {
    return
  }

  @Delete('/:version(v?\\d{1}|all)')
  deleteUsersByVersion() {
    return
  }

  @OpenAPI({
    deprecated: true,
    description: 'Insert or update a user object - DEPRECATED in v1.0.1',
    summary: ''
  })
  @Put()
  putUserDefault() {
    return
  }
}

@Controller('/users/:userId/posts')
export class UserPostsController {
  @Get('/:postId')
  getUserPost(
    @Param('userId') _userId: number,
    @Param('postId') _postId: string
  ) {
    return
  }
}

@Controller()
export class RootController {
  @Get()
  getDefaultPath() {
    return
  }

  @Get('/stringPath')
  getStringPath() {
    return
  }
}
