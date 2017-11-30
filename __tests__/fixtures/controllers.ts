// tslint:disable:no-implicit-dependencies
import { IsEmail, IsOptional, IsString } from 'class-validator'
import {
  Body,
  ContentType,
  Controller,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  QueryParam,
  QueryParams
} from 'routing-controllers'

export class CreateUserBody {
  @IsEmail() email: string
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

@JsonController('/users')
export class UsersController {
  @Get('/')
  @ContentType('text/cvs')
  listUsers(@QueryParams() _query?: ListUsersQueryParams) {
    return
  }

  @Get('/:from-:to')
  listUsersInRange(
    @Param('to') _to: number,
    @QueryParam('userId', { required: true })
    _userId: number
  ) {
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
