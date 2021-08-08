// tslint:disable:no-implicit-dependencies
import { Type } from 'class-transformer'
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator'
import {
  Body,
  BodyParam,
  ContentType,
  Controller,
  Delete,
  Get,
  HeaderParam,
  HeaderParams,
  HttpCode,
  JsonController,
  Param,
  Patch,
  Post,
  Put,
  QueryParam,
  QueryParams,
  UploadedFile,
  UploadedFiles,
} from 'routing-controllers'

import { OpenAPI, ResponseSchema } from '../../src'
import { ModelDto } from './models'

export class CreateUserBody {
  @IsEmail()
  email: string
}

export class CreateNestedBody {
  @ValidateNested({ each: true })
  @Type(() => CreateUserBody)
  users: CreateUserBody[]
}

export class CreatePostBody {
  @IsString({ each: true })
  content: string[]
}

export class CreateUserPostImagesBody {
  @IsString()
  description: string
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

export class UserQuery {
  @IsString()
  name: string
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
    statusCode: 201,
  })
  createUser(@Body() _body: CreateUserBody) {
    return
  }

  @HttpCode(201)
  @Post('/withType')
  @ResponseSchema(ModelDto, {
    description: 'Created user object',
    statusCode: 201,
  })
  createUserWithType(
    @QueryParam('user', { type: CreateUserBody }) _user: string
  ) {
    return
  }

  @Put('/')
  createManyUsers(
    @Body({ required: true, type: CreateUserBody }) _body: CreateUserBody[]
  ) {
    return
  }

  @Post('/nested')
  createNestedUsers(@Body({ required: true }) _body: CreateNestedBody) {
    return
  }

  @Post('/:userId/posts')
  createUserPost(
    @Body({ required: true }) _body: CreatePostBody,
    @BodyParam('token') _token: string
  ) {
    return
  }

  @Delete('/:version(v?\\d{1}|all)')
  deleteUsersByVersion() {
    return
  }

  @OpenAPI({
    deprecated: true,
    description: 'Insert or update a user object - DEPRECATED in v1.0.1',
    summary: '',
  })
  @Put()
  putUserDefault(
    @BodyParam('limit') _limit: number,
    @BodyParam('query') _query: UserQuery,
    @BodyParam('token', { required: true }) _token: string
  ) {
    return
  }

  @Put('/:userId/avatar')
  putUserAvatar(@UploadedFile('image') _image: any) {
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

  @Patch('/:postId')
  patchUserPost(@BodyParam('token') _token: string) {
    return
  }

  @Post('/:postId/images')
  createUserPostImages(
    @Body({ required: true }) _body: CreateUserPostImagesBody,
    @BodyParam('token') _token: string,
    @UploadedFiles('images') _images: any[]
  ) {
    return
  }
}

@Controller()
@OpenAPI({
  description: 'Common description for all RootController operations',
  security: [{ basicAuth: [] }],
})
export class RootController {
  @Get()
  getDefaultPath() {
    return
  }

  @OpenAPI((spec) => ({ ...spec, security: [] }))
  @Get('/stringPath')
  getStringPath() {
    return
  }
}
